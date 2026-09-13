<?php

namespace OrigemPHP\Servicos\IEDTypes;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class IEDTypesApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('ied_types')->select('id', 'name', 'enabled', 'created_at', 'updated_at');
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') $query->where('name', 'ilike', '%' . $search . '%');
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') $query->where('enabled', self::booleanValue($params['enabled']));
        $total = (clone $query)->count();
        $ativos = (clone $query)->where('enabled', true)->count();
        $inativos = (clone $query)->where('enabled', false)->count();
        $sorts = ['name' => 'name', 'created_at' => 'created_at', 'enabled' => 'enabled'];
        $requestedSort = $params['sort'] ?? '';
        $sort = is_string($requestedSort) ? ($sorts[$requestedSort] ?? 'name') : 'name';
        $requestedDirection = $params['direction'] ?? '';
        $direction = is_string($requestedDirection) && strtolower($requestedDirection) === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('ieds.view');
        $params = $request->getQueryParams();
        $query = DB::table('ied_types')->select('id', 'name')->where(function ($q) use ($params) {
            $q->where('enabled', true);
            if (!empty($params['include_id'])) $q->orWhere('id', $params['include_id']);
        });
        return $query->orderBy('name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('ieds.view');
        return self::find($id) ?: ['erro' => 1, 'mensagem' => 'Tipo de IED não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('ieds.manage');
        $data = $request->getPostVars();
        $error = self::validate($data);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('ied_types')->insertGetId(['name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Tipo de IED criado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de IED com este nome.' : 'Não foi possível criar o Tipo de IED.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Tipo de IED não encontrado.'];
        $data = $request->getPostVars();
        $error = self::validate($data, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('ied_types')->where('id', $id)->update(['name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Tipo de IED atualizado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de IED com este nome.' : 'Não foi possível atualizar o Tipo de IED.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('ieds.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Tipo de IED não encontrado.'];
        $data = $request->getPostVars();
        if (!array_key_exists('enabled', $data)) return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        DB::table('ied_types')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status do Tipo de IED atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function find($id) { return DB::table('ied_types')->select('id', 'name', 'enabled', 'created_at', 'updated_at')->where('id', $id)->first(); }
    private static function validate(array $data, $id = null)
    {
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') return 'Informe o nome do Tipo de IED.';
        $query = DB::table('ied_types')->where('name', $name);
        if ($id !== null) $query->where('id', '<>', $id);
        if ($query->exists()) return 'Já existe um Tipo de IED com este nome.';
        return null;
    }
    private static function booleanValue($value): bool { return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1)); }
    private static function isDuplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
