<?php

namespace OrigemPHP\Servicos\CollectionDrivers;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Config\Origem_curl\Curl;
use OrigemPHP\Servicos\Usuarios\Permissao;

class CollectionDriversApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('collection_drivers')->select('id', 'code', 'name', 'category', 'description', 'enabled', 'created_at', 'updated_at');
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('code', 'ilike', $like)->orWhere('name', 'ilike', $like)->orWhere('description', 'ilike', $like);
            });
        }
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '')
            $query->where('enabled', self::booleanValue($params['enabled']));
        $total = (clone $query)->count();
        $ativos = (clone $query)->where('enabled', true)->count();
        $inativos = (clone $query)->where('enabled', false)->count();
        $sortFields = ['code' => 'code', 'name' => 'name', 'category' => 'category', 'created_at' => 'created_at'];
        $sort = $sortFields[$params['sort'] ?? ''] ?? 'name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->paginate($perPage, ['*'], 'page', $page);
        $items = $pagination->items();
        $agentStatuses = self::agentStatuses();
        foreach ($items as $item) {
            $item->agent_status = $agentStatuses['available']
                ? ($agentStatuses['statuses'][$item->code] ?? 'not_implemented')
                : 'unavailable';
        }
        return ['data' => $items, 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $query = DB::table('collection_drivers')->select('id', 'code', 'name', 'category', 'enabled')->where(function ($q) use ($params) {
            $q->where('enabled', true);
            if (!empty($params['include_id']))
                $q->orWhere('id', $params['include_id']);
        });
        return $query->orderBy('name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('ieds.view');
        return self::find($id) ?: ['erro' => 1, 'mensagem' => 'Driver de Coleta não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('ieds.manage');
        $data = $request->getPostVars();
        $error = self::validate($data);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('collection_drivers')->insertGetId(self::data($data, true));
            return ['erro' => 0, 'mensagem' => 'Driver de Coleta criado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Driver com este código.' : 'Não foi possível criar o Driver de Coleta.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('ieds.manage');
        $current = self::find($id);
        if (!$current)
            return ['erro' => 1, 'mensagem' => 'Driver de Coleta não encontrado.'];
        $data = $request->getPostVars();
        $error = self::validate($data, $id);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        if (trim($data['code']) !== $current->code && self::isReferenced($id))
            return ['erro' => 1, 'mensagem' => 'O código não pode ser alterado enquanto o Driver estiver associado a Templates ou IEDs.'];
        try {
            DB::table('collection_drivers')->where('id', $id)->update(self::data($data));
            return ['erro' => 0, 'mensagem' => 'Driver de Coleta atualizado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Driver com este código.' : 'Não foi possível atualizar o Driver de Coleta.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id))
            return ['erro' => 1, 'mensagem' => 'Driver de Coleta não encontrado.'];
        $data = $request->getPostVars();
        if (!array_key_exists('enabled', $data))
            return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        $enabled = self::booleanValue($data['enabled']);
        if (!$enabled && self::isReferenced($id))
            return ['erro' => 1, 'mensagem' => 'O Driver não pode ser desativado enquanto estiver associado a Templates ou IEDs.'];
        DB::table('collection_drivers')->where('id', $id)->update(['enabled' => $enabled, 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status do Driver de Coleta atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function find($id)
    {
        return DB::table('collection_drivers')->select('id', 'code', 'name', 'category', 'description', 'enabled', 'created_at', 'updated_at')->where('id', $id)->first();
    }
    private static function data(array $data, bool $creating = false): array
    {
        return ['code' => trim($data['code']), 'name' => trim($data['name']), 'category' => trim((string) ($data['category'] ?? 'protocol')), 'description' => trim((string) ($data['description'] ?? '')) ?: null, 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')] + ($creating ? ['created_at' => date('Y-m-d H:i:s')] : []);
    }
    private static function validate(array $data, $id = null)
    {
        $code = trim((string) ($data['code'] ?? ''));
        $name = trim((string) ($data['name'] ?? ''));
        $category = trim((string) ($data['category'] ?? 'protocol'));
        if ($code === '')
            return 'Informe o código técnico do Driver.';
        if (!preg_match('/^[a-z0-9_-]+$/', $code))
            return 'O código deve conter apenas letras minúsculas, números, hífen ou sublinhado.';
        if ($name === '')
            return 'Informe o nome do Driver de Coleta.';
        if (!in_array($category, ['protocol', 'service', 'integration', 'strategy', 'utility', 'none'], true))
            return 'Categoria do Driver de Coleta inválida.';
        $query = DB::table('collection_drivers')->where('code', $code);
        if ($id !== null)
            $query->where('id', '<>', $id);
        if ($query->exists())
            return 'Já existe um Driver com este código.';
        return null;
    }
    private static function isReferenced($id): bool
    {
        return DB::table('ied_templates')->where('default_driver_id', $id)->exists() || DB::table('ieds')->where('driver_override_id', $id)->exists();
    }
    private static function booleanValue($value): bool
    {
        return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1));
    }
    private static function isDuplicate(\Throwable $e): bool
    {
        $message = strtolower($e->getMessage());
        return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false;
    }
    private static function agentStatuses(): array
    {
        $result = ['available' => false, 'statuses' => []];
        $agentUrl = trim((string) ($_ENV['AMTK_AGENT_URL'] ?? ''));
        if ($agentUrl === '')
            return $result;
        try {
            $curl = new Curl();
            $curl->setOpt(CURLOPT_CONNECTTIMEOUT, 2);
            $curl->setTimeout(5);
            $response = $curl->get(rtrim($agentUrl, '/') . '/api/v1/capabilities');
            if ($curl->curlError || (int) $curl->httpStatusCode !== 200)
                return $result;
            if ($response instanceof \stdClass)
                $response = (array) $response;
            if (!is_array($response) || !isset($response['drivers']))
                return $result;
            $drivers = $response['drivers'];
            if ($drivers instanceof \stdClass)
                $drivers = (array) $drivers;
            if (!is_array($drivers))
                return $result;
            foreach ($drivers as $driver) {
                if ($driver instanceof \stdClass)
                    $driver = (array) $driver;
                if (!is_array($driver) || !is_string($driver['code'] ?? null) || !in_array($driver['status'] ?? null, ['implemented', 'partial'], true))
                    return $result;
                $result['statuses'][$driver['code']] = $driver['status'];
            }
            $result['available'] = true;
        } catch (\Throwable $e) {
            return $result;
        }
        return $result;
    }
}
