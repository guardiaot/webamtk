<?php

namespace OrigemPHP\Servicos\IEDTemplates;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class IEDTemplatesApi extends BaseController
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
                $q->where('ied_templates.name', 'ilike', $like)->orWhere('ied_templates.manufacturer', 'ilike', $like)->orWhere('ied_templates.model', 'ilike', $like)->orWhere('ied_types.name', 'ilike', $like);
            });
        }
        if (!empty($params['ied_type_id'])) $query->where('ied_templates.ied_type_id', $params['ied_type_id']);
        if (($params['manufacturer'] ?? '') !== '') $query->where('ied_templates.manufacturer', 'ilike', '%' . trim($params['manufacturer']) . '%');
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') $query->where('ied_templates.enabled', self::booleanValue($params['enabled']));
        $total = (clone $query)->count('ied_templates.id');
        $ativos = (clone $query)->where('ied_templates.enabled', true)->count('ied_templates.id');
        $inativos = (clone $query)->where('ied_templates.enabled', false)->count('ied_templates.id');
        $sorts = ['name' => 'ied_templates.name', 'manufacturer' => 'ied_templates.manufacturer', 'model' => 'ied_templates.model', 'created_at' => 'ied_templates.created_at', 'enabled' => 'ied_templates.enabled'];
        $requestedSort = $params['sort'] ?? '';
        $sort = is_string($requestedSort) ? ($sorts[$requestedSort] ?? 'ied_templates.name') : 'ied_templates.name';
        $requestedDirection = $params['direction'] ?? '';
        $direction = is_string($requestedDirection) && strtolower($requestedDirection) === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('ied_templates.id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $query = self::baseQuery()->select('ied_templates.id', 'ied_templates.name', 'ied_templates.ied_type_id', 'ied_templates.manufacturer', 'ied_templates.model')->where(function ($q) use ($params) {
            $q->where('ied_templates.enabled', true);
            if (!empty($params['include_id'])) $q->orWhere('ied_templates.id', $params['include_id']);
        });
        if (!empty($params['ied_type_id'])) $query->where('ied_templates.ied_type_id', $params['ied_type_id']);
        return $query->orderBy('ied_templates.name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('ieds.view');
        return self::find($id) ?: ['erro' => 1, 'mensagem' => 'Template de IED não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('ieds.manage');
        $data = $request->getPostVars();
        $error = self::validate($data);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('ied_templates')->insertGetId(self::data($data, true));
            return ['erro' => 0, 'mensagem' => 'Template de IED criado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Template de IED com este nome.' : 'Não foi possível criar o Template de IED.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Template de IED não encontrado.'];
        $data = $request->getPostVars();
        $error = self::validate($data, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('ied_templates')->where('id', $id)->update(self::data($data));
            return ['erro' => 0, 'mensagem' => 'Template de IED atualizado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Template de IED com este nome.' : 'Não foi possível atualizar o Template de IED.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Template de IED não encontrado.'];
        $data = $request->getPostVars();
        if (!array_key_exists('enabled', $data)) return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        DB::table('ied_templates')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status do Template de IED atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function baseQuery()
    {
        return DB::table('ied_templates')->join('ied_types', 'ied_templates.ied_type_id', '=', 'ied_types.id')->leftJoin('collection_drivers', 'ied_templates.default_driver_id', '=', 'collection_drivers.id')->select('ied_templates.id', 'ied_templates.ied_type_id', 'ied_types.name as ied_type_name', 'ied_templates.default_driver_id', 'collection_drivers.name as default_driver_name', 'collection_drivers.code as default_driver_code', 'ied_templates.manufacturer', 'ied_templates.model', 'ied_templates.name', 'ied_templates.enabled', 'ied_templates.created_at', 'ied_templates.updated_at');
    }
    private static function find($id) { return self::baseQuery()->where('ied_templates.id', $id)->first(); }
    private static function data(array $data, bool $creating = false): array { $defaultDriver = trim((string) ($data['default_driver_id'] ?? '')); $defaultDriverId = $defaultDriver === '' || $defaultDriver === '0' ? null : (int) $defaultDriver; return ['ied_type_id' => (int) $data['ied_type_id'], 'default_driver_id' => $defaultDriverId, 'manufacturer' => trim($data['manufacturer']), 'model' => trim($data['model']), 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')] + ($creating ? ['created_at' => date('Y-m-d H:i:s')] : []); }
    private static function validate(array $data, $id = null)
    {
        $typeId = (int) ($data['ied_type_id'] ?? 0); $name = trim((string) ($data['name'] ?? '')); $manufacturer = trim((string) ($data['manufacturer'] ?? '')); $model = trim((string) ($data['model'] ?? ''));
        if (!$typeId) return 'Selecione o Tipo de IED.';
        $type = DB::table('ied_types')->where('id', $typeId)->first();
        if (!$type) return 'Tipo de IED não encontrado.';
        if ($id === null && !(bool) $type->enabled) return 'Selecione um Tipo de IED ativo.';
        if ($name === '') return 'Informe o nome do Template de IED.';
        if ($manufacturer === '') return 'Informe o fabricante.';
        if ($model === '') return 'Informe o modelo.';
        $defaultDriver = trim((string) ($data['default_driver_id'] ?? ''));
        if ($defaultDriver !== '' && $defaultDriver !== '0') {
            $defaultDriverId = filter_var($defaultDriver, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            $driver = $defaultDriverId ? DB::table('collection_drivers')->where('id', $defaultDriverId)->first() : null;
            if (!$driver) return 'Driver de Coleta não encontrado.';
            if (!(bool) $driver->enabled) {
                $current = $id !== null ? DB::table('ied_templates')->where('id', $id)->first() : null;
                if (!$current || (int) $current->default_driver_id !== (int) $defaultDriverId) return 'Selecione um Driver de Coleta ativo.';
            }
        }
        $query = DB::table('ied_templates')->where('name', $name); if ($id !== null) $query->where('id', '<>', $id); if ($query->exists()) return 'Já existe um Template de IED com este nome.';
        return null;
    }
    private static function booleanValue($value): bool { return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1)); }
    private static function isDuplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
