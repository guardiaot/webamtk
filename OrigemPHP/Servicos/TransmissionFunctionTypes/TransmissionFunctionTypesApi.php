<?php

namespace OrigemPHP\Servicos\TransmissionFunctionTypes;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class TransmissionFunctionTypesApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('transmission_functions.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('transmission_function_types')->select('id', 'name', 'enabled', 'created_at', 'updated_at');
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '')
            $query->where('name', 'ilike', '%' . $search . '%');
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '')
            $query->where('enabled', self::booleanValue($params['enabled']));
        $total = (clone $query)->count();
        $ativos = (clone $query)->where('enabled', true)->count();
        $inativos = (clone $query)->where('enabled', false)->count();
        $sorts = ['name' => 'transmission_function_types.name', 'created_at' => 'transmission_function_types.created_at', 'enabled' => 'transmission_function_types.enabled'];
        $requestedSort = $params['sort'] ?? '';
        $sort = is_string($requestedSort) ? ($sorts[$requestedSort] ?? 'transmission_function_types.name') : 'transmission_function_types.name';
        $requestedDirection = $params['direction'] ?? '';
        $direction = is_string($requestedDirection) && strtolower($requestedDirection) === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('transmission_function_types.id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('transmission_functions.view');
        $query = DB::table('transmission_function_types')->select('id', 'name')->where('enabled', true);
        $params = $request->getQueryParams();
        if (!empty($params['include_id']))
            $query->orWhere('id', $params['include_id']);
        return $query->orderBy('name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('transmission_functions.view');
        $type = self::find($id);
        return $type ?: ['erro' => 1, 'mensagem' => 'Tipo de Função de Transmissão não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('transmission_functions.manage');
        $data = self::data($request);
        $error = self::validate($data);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('transmission_function_types')->insertGetId(['name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Tipo de Função de Transmissão criado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de Função de Transmissão com este nome.' : 'Não foi possível criar o Tipo de Função de Transmissão.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('transmission_functions.manage');
        if (!self::find($id))
            return ['erro' => 1, 'mensagem' => 'Tipo de Função de Transmissão não encontrado.'];
        $data = self::data($request);
        $error = self::validate($data, $id);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('transmission_function_types')->where('id', $id)->update(['name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Tipo de Função de Transmissão atualizado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de Função de Transmissão com este nome.' : 'Não foi possível atualizar o Tipo de Função de Transmissão.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('transmission_functions.manage');
        if (!self::find($id))
            return ['erro' => 1, 'mensagem' => 'Tipo de Função de Transmissão não encontrado.'];
        $data = self::data($request);
        if (!array_key_exists('enabled', $data))
            return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        DB::table('transmission_function_types')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function find($id)
    {
        return DB::table('transmission_function_types')->select('id', 'name', 'enabled', 'created_at', 'updated_at')->where('id', $id)->first();
    }
    private static function data($request): array
    {
        return $request->getPostVars();
    }
    private static function validate(array $data, $id = null)
    {
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '')
            return 'Informe o nome do Tipo de Função de Transmissão.';
        $query = DB::table('transmission_function_types')->where('name', $name);
        if ($id)
            $query->where('id', '<>', $id);
        if ($query->exists())
            return 'Já existe um Tipo de Função de Transmissão com este nome.';
        return null;
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
}
