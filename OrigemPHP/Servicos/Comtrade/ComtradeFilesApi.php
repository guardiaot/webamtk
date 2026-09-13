<?php

namespace OrigemPHP\Servicos\Comtrade;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Audit\UserActivityLogger;
use OrigemPHP\Servicos\Logs\SystemLogger;
use OrigemPHP\Servicos\Usuarios\Permissao;

class ComtradeFilesApi extends BaseController
{
    public static function download($request, $recordId, $type)
    {
        Permissao::proteger('comtrade.download');

        if (!ctype_digit((string) $recordId) || (int) $recordId <= 0 ||
            !in_array($type, ['cfg', 'dat'], true)) {
            SystemLogger::registrar('WARNING', 'COMTRADE_DOWNLOAD', 'Arquivo COMTRADE não encontrado.', ['record_id' => $recordId, 'file_type' => $type]);
            throw new \Exception('Arquivo COMTRADE não encontrado.', 404);
        }

        $file = DB::table('comtrade_files')
            ->where('comtrade_record_id', (int) $recordId)
            ->where('file_type', $type)
            ->first(['filename', 'content']);

        if (!$file) {
            SystemLogger::registrar('WARNING', 'COMTRADE_DOWNLOAD', 'Arquivo COMTRADE não encontrado.', ['record_id' => $recordId, 'file_type' => $type]);
            throw new \Exception('Arquivo COMTRADE não encontrado.', 404);
        }

        $content = $file->content;
        if (is_resource($content)) {
            $content = stream_get_contents($content);
        }

        if (!is_string($content)) {
            SystemLogger::registrar('ERROR', 'COMTRADE_DOWNLOAD', 'Não foi possível ler o arquivo COMTRADE.', ['record_id' => $recordId, 'file_type' => $type, 'filename' => $file->filename ?? null]);
            throw new \Exception('Não foi possível ler o arquivo COMTRADE.', 500);
        }

        $filename = basename(str_replace('\\', '/', (string) $file->filename));
        $filename = preg_replace('/[\x00-\x1F\x7F"]/', '', $filename);
        if ($filename === '') {
            $filename = 'comtrade.' . $type;
        }

        $response = new Response(200, $content, 'text/html');
        $response->addHeader('Content-Type', 'application/octet-stream');
        $response->addHeader('Content-Length', (string) strlen($content));
        $response->addHeader('Content-Disposition', 'attachment; filename="' . $filename . '"');
        UserActivityLogger::registrar('DOWNLOAD', 'COMTRADE', 'Arquivo COMTRADE baixado.', 'comtrade_record', $recordId, ['file_type' => $type, 'filename' => $filename]);

        return $response;
    }
}
