<?php

namespace OrigemPHP\Servicos\IED;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Models\IED;
use OrigemPHP\Servicos\Logs\SystemLogger;
use OrigemPHP\Servicos\Usuarios\Permissao;

class IedsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = self::baseQuery();
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('ieds.code', 'ilike', $like)->orWhere('ieds.name', 'ilike', $like)
                    ->orWhere('ieds.manufacturer', 'ilike', $like)->orWhere('ieds.model', 'ilike', $like)
                    ->orWhere('ieds.host', 'ilike', $like)->orWhere('transmission_functions.name', 'ilike', $like)
                    ->orWhere('installations.name', 'ilike', $like)->orWhere('regionals.name', 'ilike', $like)
                    ->orWhere('owners.name', 'ilike', $like)->orWhere('ied_templates.name', 'ilike', $like);
            });
        }
        foreach (['owner_id' => 'owners.id', 'regional_id' => 'regionals.id', 'installation_id' => 'installations.id', 'transmission_function_id' => 'ieds.transmission_function_id'] as $key => $column) {
            if (!empty($params[$key])) $query->where($column, $params[$key]);
        }
        foreach (['manufacturer', 'status'] as $key) {
            if (($params[$key] ?? '') !== '') $query->where('ieds.' . $key, $key === 'manufacturer' ? 'ilike' : '=', $key === 'manufacturer' ? '%' . trim($params[$key]) . '%' : $params[$key]);
        }
        $total = (clone $query)->count('ieds.id');
        $online = (clone $query)->where('ieds.status', 'online')->count('ieds.id');
        $offline = (clone $query)->where('ieds.status', 'offline')->count('ieds.id');
        $unknown = $total - $online - $offline;
        $sorts = ['code' => 'ieds.code', 'name' => 'ieds.name', 'manufacturer' => 'ieds.manufacturer', 'status' => 'ieds.status', 'last_seen' => 'ieds.last_seen'];
        $sort = $sorts[$params['sort'] ?? ''] ?? 'ieds.name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('ieds.id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'online' => $online, 'offline' => $offline, 'unknown' => $unknown];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $query = self::baseQuery()->select('ieds.id', 'ieds.code', 'ieds.name', 'ieds.transmission_function_id', 'ieds.host');
        foreach (['owner_id' => 'owners.id', 'regional_id' => 'regionals.id', 'installation_id' => 'installations.id', 'transmission_function_id' => 'ieds.transmission_function_id'] as $key => $column) {
            if (!empty($params[$key])) $query->where($column, $params[$key]);
        }
        return $query->orderBy('ieds.name')->get();
    }

    public static function visualizar($request, $id)
    {
        Permissao::proteger('ieds.view');
        return self::baseQuery()->where('ieds.id', $id)->first() ?: ['erro' => 1, 'mensagem' => 'IED não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('ieds.manage');
        $data = self::data($request);
        $error = self::validate($data);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('ieds')->insertGetId(array_merge(self::configData($data), ['source' => 'manual', 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]));
            return ['erro' => 0, 'mensagem' => 'IED criado com sucesso.', 'data' => self::visualizarSemPermission($id)];
        } catch (\Throwable $e) {
            SystemLogger::registrar('ERROR', 'IED_CREATE', 'Exception ao criar IED.', ['exception' => get_class($e), 'message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine(), 'code' => trim((string) ($data['code'] ?? ''))]);
            return ['erro' => 1, 'mensagem' => self::duplicate($e) ? 'Já existe um IED com este código.' : 'Não foi possível criar o IED.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'IED não encontrado.'];
        $data = self::data($request);
        $error = self::validate($data, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('ieds')->where('id', $id)->update(array_merge(self::configData($data), ['updated_at' => date('Y-m-d H:i:s')]));
            return ['erro' => 0, 'mensagem' => 'IED atualizado com sucesso.', 'data' => self::visualizarSemPermission($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::duplicate($e) ? 'Já existe um IED com este código.' : 'Não foi possível atualizar o IED.'];
        }
    }

    private static function baseQuery()
    {
        return DB::table('ieds')->leftJoin('transmission_functions', 'ieds.transmission_function_id', '=', 'transmission_functions.id')->leftJoin('installations', 'transmission_functions.installation_id', '=', 'installations.id')->leftJoin('regionals', 'installations.regional_id', '=', 'regionals.id')->leftJoin('owners', 'regionals.owner_id', '=', 'owners.id')->leftJoin('ied_templates', 'ieds.ied_template_id', '=', 'ied_templates.id')->leftJoin('ied_types', 'ied_templates.ied_type_id', '=', 'ied_types.id')->leftJoin('collection_drivers as default_driver', 'ied_templates.default_driver_id', '=', 'default_driver.id')->leftJoin('collection_drivers as override_driver', 'ieds.driver_override_id', '=', 'override_driver.id')->select('ieds.id', 'ieds.agent_id', 'ieds.code', 'ieds.name', 'ieds.manufacturer', 'ieds.model', 'ieds.host', 'ieds.port', 'ieds.status', 'ieds.source', 'ieds.response_time_us', 'ieds.last_check', 'ieds.last_seen', 'ieds.failures', 'ieds.checks', 'ieds.consecutive_failures', 'ieds.transmission_function_id', 'transmission_functions.name as transmission_function_name', 'installations.id as installation_id', 'installations.name as installation_name', 'regionals.id as regional_id', 'regionals.name as regional_name', 'owners.id as owner_id', 'owners.name as owner_name', 'ieds.ied_template_id', 'ied_templates.name as ied_template_name', 'ied_templates.ied_type_id', 'ied_types.name as ied_type_name', 'ied_templates.default_driver_id', 'default_driver.name as default_driver_name', 'default_driver.code as default_driver_code', 'ieds.driver_override_id', 'override_driver.name as driver_override_name', 'override_driver.code as driver_override_code', DB::raw("CASE WHEN ieds.driver_override_id IS NOT NULL THEN override_driver.id ELSE default_driver.id END as effective_driver_id"), DB::raw("CASE WHEN ieds.driver_override_id IS NOT NULL THEN override_driver.name ELSE default_driver.name END as effective_driver_name"), DB::raw("CASE WHEN ieds.driver_override_id IS NOT NULL THEN override_driver.code ELSE default_driver.code END as effective_driver_code"), DB::raw("CASE WHEN ieds.driver_override_id IS NOT NULL THEN 'override' WHEN default_driver.id IS NOT NULL THEN 'template' ELSE NULL END as effective_driver_source"), 'ieds.created_at', 'ieds.updated_at');
    }

    private static function find($id) { return DB::table('ieds')->where('id', $id)->first(); }
    private static function visualizarSemPermission($id) { return self::baseQuery()->where('ieds.id', $id)->first(); }
    private static function data($request): array { return $request->getPostVars(); }
    private static function configData(array $data): array { $template = trim((string) ($data['ied_template_id'] ?? '')); $override = trim((string) ($data['driver_override_id'] ?? '')); return ['code' => trim($data['code']), 'name' => trim($data['name']), 'manufacturer' => trim((string) ($data['manufacturer'] ?? '')) ?: null, 'model' => trim((string) ($data['model'] ?? '')) ?: null, 'host' => trim($data['host']), 'port' => (int) $data['port'], 'transmission_function_id' => !empty($data['transmission_function_id']) ? (int) $data['transmission_function_id'] : null, 'ied_template_id' => $template === '' || $template === '0' ? null : (int) $template, 'driver_override_id' => $override === '' || $override === '0' ? null : (int) $override]; }
    private static function validate(array $data, $id = null)
    {
        $code = trim((string) ($data['code'] ?? '')); $name = trim((string) ($data['name'] ?? '')); $host = trim((string) ($data['host'] ?? '')); $port = filter_var($data['port'] ?? null, FILTER_VALIDATE_INT);
        if ($code === '') return 'Informe o código do IED.';
        if ($name === '') return 'Informe o nome do IED.';
        if ($host === '') return 'Informe o host ou endereço IP.';
        if ($port === false || $port < 1 || $port > 65535) return 'Informe uma porta entre 1 e 65535.';
        $query = DB::table('ieds')->where('code', $code); if ($id !== null) $query->where('id', '<>', $id); if ($query->exists()) return 'Já existe um IED com este código.';
        if (!empty($data['transmission_function_id'])) {
            $function = DB::table('transmission_functions')->where('id', $data['transmission_function_id'])->first();
            if (!$function) return 'Função de Transmissão não encontrada.';
            if ($id === null && !(bool) $function->enabled) return 'Selecione uma Função de Transmissão ativa.';
        }
        $template = trim((string) ($data['ied_template_id'] ?? ''));
        if ($template !== '' && $template !== '0') {
            $templateId = filter_var($template, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            $record = $templateId ? DB::table('ied_templates')->where('id', $templateId)->first() : null;
            if (!$record) return 'Template de IED não encontrado.';
            if (!(bool) $record->enabled) {
                $current = $id !== null ? DB::table('ieds')->where('id', $id)->first() : null;
                if (!$current || (int) $current->ied_template_id !== (int) $templateId) return 'Selecione um Template de IED ativo.';
            }
        }
        $override = trim((string) ($data['driver_override_id'] ?? ''));
        if ($override !== '' && $override !== '0') {
            $overrideId = filter_var($override, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            $driver = $overrideId ? DB::table('collection_drivers')->where('id', $overrideId)->first() : null;
            if (!$driver) return 'Driver de Coleta não encontrado.';
            if (!(bool) $driver->enabled) {
                $current = $id !== null ? DB::table('ieds')->where('id', $id)->first() : null;
                if (!$current || (int) $current->driver_override_id !== (int) $overrideId) return 'Selecione um Driver de Coleta ativo.';
            }
        }
        return null;
    }
    private static function duplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
