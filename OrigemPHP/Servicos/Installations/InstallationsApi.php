<?php

namespace OrigemPHP\Servicos\Installations;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class InstallationsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('installations.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = self::baseQuery();
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $search = '%' . $search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('installations.name', 'ilike', $search)
                    ->orWhere('regionals.name', 'ilike', $search)
                    ->orWhere('regionals.abbreviation', 'ilike', $search)
                    ->orWhere('owners.name', 'ilike', $search)
                    ->orWhere('states.name', 'ilike', $search)
                    ->orWhere('states.abbreviation', 'ilike', $search);
            });
        }
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') $query->where('installations.enabled', self::booleanValue($params['enabled']));
        if (!empty($params['owner_id'])) $query->where('regionals.owner_id', $params['owner_id']);
        if (!empty($params['regional_id'])) $query->where('installations.regional_id', $params['regional_id']);
        if (!empty($params['state_id'])) $query->where('installations.state_id', $params['state_id']);
        $total = (clone $query)->count('installations.id');
        $ativos = (clone $query)->where('installations.enabled', true)->count('installations.id');
        $inativos = (clone $query)->where('installations.enabled', false)->count('installations.id');
        $sortFields = ['name' => 'installations.name', 'owner_name' => 'owners.name', 'regional_name' => 'regionals.name', 'state_name' => 'states.name', 'created_at' => 'installations.created_at'];
        $sort = $sortFields[$params['sort'] ?? ''] ?? 'installations.name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('installations.id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('installations.view');
        $query = DB::table('installations')->select('id', 'regional_id', 'state_id', 'name')->where('enabled', true);
        $params = $request->getQueryParams();
        if (!empty($params['regional_id'])) $query->where('regional_id', $params['regional_id']);
        if (!empty($params['include_id'])) $query->orWhere('id', $params['include_id']);
        return $query->orderBy('name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('installations.view');
        $installation = self::find($id);
        return $installation ?: ['erro' => 1, 'mensagem' => 'Instalação não encontrada.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('installations.manage');
        $data = self::data($request);
        $error = self::validate($data, true);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::table('installations')->insertGetId(['regional_id' => (int) $data['regional_id'], 'state_id' => (int) $data['state_id'], 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Instalação criada com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe esta instalação para a Regional e UF selecionadas.' : 'Não foi possível criar a instalação.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('installations.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Instalação não encontrada.'];
        $data = self::data($request);
        $error = self::validate($data, false, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('installations')->where('id', $id)->update(['regional_id' => (int) $data['regional_id'], 'state_id' => (int) $data['state_id'], 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')]);
            return ['erro' => 0, 'mensagem' => 'Instalação atualizada com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe esta instalação para a Regional e UF selecionadas.' : 'Não foi possível atualizar a instalação.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('installations.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Instalação não encontrada.'];
        $data = self::data($request);
        if (!array_key_exists('enabled', $data)) return ['erro' => 1, 'mensagem' => 'Informe o novo status da instalação.'];
        DB::table('installations')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status da instalação atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function baseQuery()
    {
        return DB::table('installations')->join('regionals', 'installations.regional_id', '=', 'regionals.id')->join('owners', 'regionals.owner_id', '=', 'owners.id')->join('states', 'installations.state_id', '=', 'states.id')->select('installations.id', 'installations.name', 'installations.regional_id', 'regionals.name as regional_name', 'regionals.abbreviation as regional_abbreviation', 'owners.id as owner_id', 'owners.name as owner_name', 'installations.state_id', 'states.name as state_name', 'states.abbreviation as state_abbreviation', 'installations.enabled', 'installations.created_at', 'installations.updated_at');
    }

    private static function find($id) { return self::baseQuery()->where('installations.id', $id)->first(); }
    private static function data($request): array { return $request->getPostVars(); }

    private static function validate(array $data, bool $creating, $id = null)
    {
        $regionalId = (int) ($data['regional_id'] ?? 0); $stateId = (int) ($data['state_id'] ?? 0);
        if (!$regionalId) return 'Selecione uma Regional.';
        $regional = DB::table('regionals')->join('owners', 'regionals.owner_id', '=', 'owners.id')->select('regionals.id', 'regionals.enabled as regional_enabled', 'owners.enabled as owner_enabled')->where('regionals.id', $regionalId)->first();
        if (!$regional) return 'Regional não encontrada.';
        if ($creating && (!(bool) $regional->regional_enabled || !(bool) $regional->owner_enabled)) return 'Selecione uma Regional ativa de um proprietário ativo.';
        if (!$stateId) return 'Selecione uma UF.';
        $state = DB::table('states')->where('id', $stateId)->first();
        if (!$state) return 'UF não encontrada.';
        if ($creating && !(bool) $state->enabled) return 'Selecione uma UF ativa.';
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') return 'Informe o nome da instalação.';
        $duplicate = DB::table('installations')->where('regional_id', $regionalId)->where('state_id', $stateId)->where('name', $name)->when($id, function ($q) use ($id) { $q->where('id', '<>', $id); })->exists();
        if ($duplicate) return 'Já existe esta instalação para a Regional e UF selecionadas.';
        return null;
    }

    private static function booleanValue($value): bool { return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1)); }
    private static function isDuplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
