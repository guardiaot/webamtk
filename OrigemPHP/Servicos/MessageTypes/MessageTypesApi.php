<?php

namespace OrigemPHP\Servicos\MessageTypes;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Audit\UserActivityLogger;
use OrigemPHP\Servicos\Usuarios\Permissao;

class MessageTypesApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('message_types.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('message_types')->select('id', 'code', 'name', 'enabled', 'created_at', 'updated_at');
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) { $q->where('code', 'ilike', $like)->orWhere('name', 'ilike', $like); });
        }
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') $query->where('enabled', self::booleanValue($params['enabled']));
        $total = (clone $query)->count(); $ativos = (clone $query)->where('enabled', true)->count(); $inativos = (clone $query)->where('enabled', false)->count();
        $sortFields = ['code' => 'code', 'name' => 'name', 'created_at' => 'created_at']; $sort = $sortFields[$params['sort'] ?? ''] ?? 'name'; $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('message_types.view');
        return self::find($id) ?: ['erro' => 1, 'mensagem' => 'Tipo de Mensagem não encontrado.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('message_types.manage');
        $data = $request->getPostVars(); $error = self::validate($data);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('message_types')->insertGetId(self::data($data, true));
            UserActivityLogger::registrar('CREATE', 'MESSAGE_TYPES', 'Tipo de Mensagem criado.', 'message_type', $id, ['code' => trim($data['code']), 'name' => trim($data['name'])]);
            return ['erro' => 0, 'mensagem' => 'Tipo de Mensagem criado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) { return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de Mensagem com este código.' : 'Não foi possível criar o Tipo de Mensagem.']; }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('message_types.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Tipo de Mensagem não encontrado.'];
        $data = $request->getPostVars(); $error = self::validate($data, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('message_types')->where('id', $id)->update(self::data($data));
            UserActivityLogger::registrar('UPDATE', 'MESSAGE_TYPES', 'Tipo de Mensagem atualizado.', 'message_type', $id, ['code' => trim($data['code']), 'name' => trim($data['name'])]);
            return ['erro' => 0, 'mensagem' => 'Tipo de Mensagem atualizado com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) { return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe um Tipo de Mensagem com este código.' : 'Não foi possível atualizar o Tipo de Mensagem.']; }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('message_types.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Tipo de Mensagem não encontrado.'];
        $data = $request->getPostVars(); if (!array_key_exists('enabled', $data)) return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        DB::table('message_types')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        $current = self::find($id);
        UserActivityLogger::registrar('STATUS_CHANGE', 'MESSAGE_TYPES', 'Status do Tipo de Mensagem alterado.', 'message_type', $id, ['code' => $current->code, 'enabled' => (bool) $current->enabled]);
        return ['erro' => 0, 'mensagem' => 'Status do Tipo de Mensagem atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function find($id) { return DB::table('message_types')->select('id', 'code', 'name', 'enabled', 'created_at', 'updated_at')->where('id', $id)->first(); }
    private static function data(array $data, bool $creating = false): array { return ['code' => trim($data['code']), 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')] + ($creating ? ['created_at' => date('Y-m-d H:i:s')] : []); }
    private static function validate(array $data, $id = null)
    {
        $code = trim((string) ($data['code'] ?? '')); $name = trim((string) ($data['name'] ?? ''));
        if ($code === '') return 'Informe o código do Tipo de Mensagem.';
        if (strlen($code) > 150) return 'O código do Tipo de Mensagem deve ter no máximo 150 caracteres.';
        if (!preg_match('/^[a-z0-9_-]+$/', $code)) return 'O código deve conter apenas letras minúsculas, números, hífen ou sublinhado.';
        if ($name === '') return 'Informe o nome do Tipo de Mensagem.';
        if (strlen($name) > 255) return 'O nome do Tipo de Mensagem deve ter no máximo 255 caracteres.';
        $query = DB::table('message_types')->where('code', $code); if ($id !== null) $query->where('id', '<>', $id); if ($query->exists()) return 'Já existe um Tipo de Mensagem com este código.';
        return null;
    }
    private static function booleanValue($value): bool { return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1)); }
    private static function isDuplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
