<?php

namespace OrigemPHP\Servicos\Maintenance;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Config\Origem_curl\Curl;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Audit\UserActivityLogger;
use OrigemPHP\Servicos\Logs\SystemLogger;
use OrigemPHP\Servicos\Usuarios\Permissao;

class UploadApi extends BaseController
{
    public static function importar($request)
    {
        Permissao::proteger('comtrade.upload');

        $iedId = $_POST['ied_id'] ?? null;
        $cfg = $_FILES['cfg'] ?? null;
        $dat = $_FILES['dat'] ?? null;

        if (!is_scalar($iedId) || !ctype_digit((string) $iedId) || (int) $iedId <= 0) {
            return self::responder(400, ['error' => 'IED inválido.']);
        }

        if (!self::validarArquivo($cfg, 'cfg', 1024 * 1024) ||
            !self::validarArquivo($dat, 'dat', 32 * 1024 * 1024) ||
            strcasecmp(self::basenameSemExtensao($cfg['name']), self::basenameSemExtensao($dat['name'])) !== 0) {
            return self::responder(400, ['error' => 'Arquivos COMTRADE inválidos.']);
        }

        $agentUrl = trim((string) ($_ENV['AMTK_AGENT_URL'] ?? ''));
        $agentToken = trim((string) ($_ENV['AMTK_AGENT_API_TOKEN'] ?? ''));

        if ($agentUrl === '' || $agentToken === '') {
            SystemLogger::registrar('ERROR', 'COMTRADE_UPLOAD', 'Serviço de importação indisponível.', ['ied_id' => (int) $iedId, 'cfg_filename' => $cfg['name'], 'dat_filename' => $dat['name']]);
            return self::responder(503, ['error' => 'Serviço de importação indisponível.']);
        }

        try {
            $curl = new Curl();
            $curl->setHeader('Authorization', 'Bearer ' . $agentToken);
            $curl->setOpt(CURLOPT_CONNECTTIMEOUT, 15);
            $curl->setTimeout(120);

            $response = $curl->post(
                rtrim($agentUrl, '/') . '/api/v1/comtrade/upload',
                [
                    'ied_id' => (string) $iedId,
                    'cfg' => new \CURLFile($cfg['tmp_name'], 'application/octet-stream', $cfg['name']),
                    'dat' => new \CURLFile($dat['tmp_name'], 'application/octet-stream', $dat['name']),
                ]
            );

            if ($response instanceof \stdClass) {
                $response = (array) $response;
            }

            if ($curl->curlError) {
                SystemLogger::registrar('ERROR', 'COMTRADE_UPLOAD', 'Erro de comunicação com o Agent.', ['ied_id' => (int) $iedId, 'cfg_filename' => $cfg['name'], 'dat_filename' => $dat['name'], 'curl_error_code' => $curl->curlErrorCode]);
                return self::responder(503, ['error' => 'Serviço de importação indisponível.']);
            }

            $status = (int) $curl->httpStatusCode;
            if ($status === 201 && is_array($response) &&
                ($response['status'] ?? null) === 'created' &&
                filter_var($response['comtrade_record_id'] ?? null, FILTER_VALIDATE_INT) > 0) {
                UserActivityLogger::registrar('UPLOAD', 'COMTRADE', 'COMTRADE importado manualmente.', 'comtrade_record', $response['comtrade_record_id'], ['ied_id' => (int) $iedId, 'cfg_filename' => $cfg['name'], 'dat_filename' => $dat['name'], 'source' => 'manual']);
                return self::responder(201, [
                    'status' => 'created',
                    'comtrade_record_id' => (int) $response['comtrade_record_id'],
                ]);
            }

            $messages = [
                400 => [400, 'Arquivos COMTRADE inválidos.'],
                404 => [404, 'IED não encontrado ou indisponível para importação.'],
                409 => [409, 'Este registro COMTRADE já foi importado.'],
                413 => [413, 'Arquivos COMTRADE excedem o tamanho permitido.'],
            ];

            if (isset($messages[$status])) {
                return self::responder($messages[$status][0], ['error' => $messages[$status][1]]);
            }

            SystemLogger::registrar('ERROR', 'COMTRADE_UPLOAD', 'Resposta inesperada do Agent.', ['ied_id' => (int) $iedId, 'cfg_filename' => $cfg['name'], 'dat_filename' => $dat['name'], 'agent_http_status' => $status]);
            return self::responder(502, ['error' => 'Falha no processamento dos arquivos COMTRADE.']);
        } catch (\Throwable $e) {
            SystemLogger::registrar('ERROR', 'COMTRADE_UPLOAD', 'Exception ao processar upload COMTRADE.', ['ied_id' => (int) $iedId, 'cfg_filename' => $cfg['name'], 'dat_filename' => $dat['name']]);
            return self::responder(503, ['error' => 'Serviço de importação indisponível.']);
        }
    }

    private static function validarArquivo($arquivo, $extensao, $tamanhoMaximo)
    {
        if (!is_array($arquivo) ||
            ($arquivo['error'] ?? null) !== UPLOAD_ERR_OK ||
            empty($arquivo['tmp_name']) ||
            !is_uploaded_file($arquivo['tmp_name']) ||
            !is_file($arquivo['tmp_name']) ||
            (int) ($arquivo['size'] ?? 0) <= 0 ||
            (int) $arquivo['size'] > $tamanhoMaximo) {
            return false;
        }

        $nome = (string) ($arquivo['name'] ?? '');
        if ($nome === '' || $nome !== basename($nome) || strpos($nome, '/') !== false || strpos($nome, '\\') !== false) {
            return false;
        }

        return strcasecmp(pathinfo($nome, PATHINFO_EXTENSION), $extensao) === 0;
    }

    private static function basenameSemExtensao($nome)
    {
        return pathinfo($nome, PATHINFO_FILENAME);
    }

    private static function responder($status, $payload)
    {
        return new Response(
            $status,
            json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'application/json'
        );
    }
}
