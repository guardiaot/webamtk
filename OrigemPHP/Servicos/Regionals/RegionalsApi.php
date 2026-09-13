<?php

namespace OrigemPHP\Servicos\Regionals;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class RegionalsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('regionals.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('regionals')->join('owners', 'regionals.owner_id', '=', 'owners.id')->select(
            'regionals.id', 'regionals.owner_id', 'owners.name as owner_name', 'regionals.name',
            'regionals.abbreviation', 'regionals.enabled', 'regionals.created_at', 'regionals.updated_at'
        );

        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $search = '%' . $search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('regionals.name', 'ilike', $search)
                    ->orWhere('regionals.abbreviation', 'ilike', $search)
                    ->orWhere('owners.name', 'ilike', $search);
            });
        }
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') {
            $query->where('regionals.enabled', self::booleanValue($params['enabled']));
        }
        if (!empty($params['owner_id'])) $query->where('regionals.owner_id', $params['owner_id']);

        $total = (clone $query)->count('regionals.id');
        $ativos = (clone $query)->where('regionals.enabled', true)->count('regionals.id');
        $inativos = (clone $query)->where('regionals.enabled', false)->count('regionals.id');
        $sortFields = ['name' => 'regionals.name', 'abbreviation' => 'regionals.abbreviation', 'owner_name' => 'owners.name', 'created_at' => 'regionals.created_at'];
        $sort = $sortFields[$params['sort'] ?? ''] ?? 'regionals.name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('regionals.id', 'asc')->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $pagination->items(), 'current_page' => $pagination->currentPage(),
            'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(),
            'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(),
            'ativos' => $ativos, 'inativos' => $inativos,
        ];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('regionals.view');
        $query = DB::table('regionals')->select('id', 'owner_id', 'name', 'abbreviation')->where('enabled', true);
        $params = $request->getQueryParams();
        if (!empty($params['owner_id'])) $query->where('owner_id', $params['owner_id']);
        if (!empty($params['include_id'])) $query->orWhere('id', $params['include_id']);
        return $query->orderBy('name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('regionals.view');
        $regional = self::find($id);
        return $regional ?: ['erro' => 1, 'mensagem' => 'Regional não encontrada.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('regionals.manage');
        $data = self::data($request);
        $error = self::validate($data, true);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            $regional = DB::table('regionals')->insertGetId([
                'owner_id' => (int) $data['owner_id'], 'name' => trim($data['name']),
                'abbreviation' => self::nullableString($data['abbreviation'] ?? null),
                'enabled' => self::booleanValue($data['enabled'] ?? true),
                'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s'),
            ]);
            return ['erro' => 0, 'mensagem' => 'Regional criada com sucesso.', 'data' => self::find($regional)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe esta regional para o proprietário selecionado.' : 'Não foi possível criar a regional.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('regionals.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Regional não encontrada.'];
        $data = self::data($request);
        $error = self::validate($data, false, $id);
        if ($error) return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::table('regionals')->where('id', $id)->update([
                'owner_id' => (int) $data['owner_id'], 'name' => trim($data['name']),
                'abbreviation' => self::nullableString($data['abbreviation'] ?? null),
                'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s'),
            ]);
            return ['erro' => 0, 'mensagem' => 'Regional atualizada com sucesso.', 'data' => self::find($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe esta regional para o proprietário selecionado.' : 'Não foi possível atualizar a regional.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('regionals.manage');
        if (!self::find($id)) return ['erro' => 1, 'mensagem' => 'Regional não encontrada.'];
        $data = self::data($request);
        if (!array_key_exists('enabled', $data)) return ['erro' => 1, 'mensagem' => 'Informe o novo status da regional.'];
        DB::table('regionals')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status da regional atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function find($id)
    {
        return DB::table('regionals')->join('owners', 'regionals.owner_id', '=', 'owners.id')->select('regionals.id', 'regionals.owner_id', 'owners.name as owner_name', 'regionals.name', 'regionals.abbreviation', 'regionals.enabled', 'regionals.created_at', 'regionals.updated_at')->where('regionals.id', $id)->first();
    }

    private static function data($request): array { return $request->getPostVars(); }

    private static function validate(array $data, bool $creating, $id = null)
    {
        $ownerId = (int) ($data['owner_id'] ?? 0);
        if (!$ownerId) return 'Selecione um proprietário.';
        $owner = DB::table('owners')->where('id', $ownerId)->first();
        if (!$owner) return 'Proprietário não encontrado.';
        if ($creating && !(bool) $owner->enabled) return 'Selecione um proprietário ativo.';
        if (trim((string) ($data['name'] ?? '')) === '') return 'Informe o nome da regional.';
        $duplicate = DB::table('regionals')->where('owner_id', $ownerId)->where('name', trim($data['name']))->when($id, function ($q) use ($id) { $q->where('id', '<>', $id); })->exists();
        if ($duplicate) return 'Já existe esta regional para o proprietário selecionado.';
        return null;
    }

    private static function nullableString($value) { $value = trim((string) ($value ?? '')); return $value === '' ? null : $value; }
    private static function booleanValue($value): bool { return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1)); }
    private static function isDuplicate(\Throwable $e): bool { $message = strtolower($e->getMessage()); return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false; }
}
