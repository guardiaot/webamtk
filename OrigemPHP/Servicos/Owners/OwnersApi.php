<?php

namespace OrigemPHP\Servicos\Owners;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Models\Owner;
use OrigemPHP\Servicos\Usuarios\Permissao;

class OwnersApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('owners.view');
        $queryParams = $request->getQueryParams();
        $pagina = max(1, (int) ($queryParams['page'] ?? 1));
        $perPage = (int) ($queryParams['per_page'] ?? 20);
        $perPage = min(100, max(1, $perPage));

        $owners = DB::table('owners')
            ->select(
                'owners.id',
                'owners.name',
                'owners.ons_name',
                'owners.ons_ftp_folder',
                'owners.enabled',
                'owners.created_at',
                'owners.updated_at'
            );

        if (isset($queryParams['search']) && trim($queryParams['search']) !== '') {
            $search = '%' . trim($queryParams['search']) . '%';
            $owners->where(function ($query) use ($search) {
                $query->where('owners.name', 'like', $search)
                    ->orWhere('owners.ons_name', 'like', $search)
                    ->orWhere('owners.ons_ftp_folder', 'like', $search);
            });
        }

        if (isset($queryParams['enabled']) && $queryParams['enabled'] !== '') {
            $owners->where('owners.enabled', self::booleanValue($queryParams['enabled']));
        }

        $total = (clone $owners)->count();
        $ativos = (clone $owners)->where('owners.enabled', true)->count();
        $inativos = (clone $owners)->where('owners.enabled', false)->count();

        $paginacao = $owners->orderBy('owners.name', 'asc')
            ->paginate($perPage, ['*'], 'page', $pagina);

        return [
            'data' => $paginacao->items(),
            'current_page' => $paginacao->currentPage(),
            'last_page' => $paginacao->lastPage(),
            'per_page' => $paginacao->perPage(),
            'total' => $total,
            'from' => $paginacao->firstItem(),
            'to' => $paginacao->lastItem(),
            'ativos' => $ativos,
            'inativos' => $inativos,
        ];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('owners.view');
        $queryParams = $request->getQueryParams();
        $query = DB::table('owners')
            ->select('id', 'name', 'ons_name', 'enabled')
            ->where(function ($query) use ($queryParams) {
                $query->where('enabled', true);
                if (!empty($queryParams['include_id'])) $query->orWhere('id', $queryParams['include_id']);
            });
        return $query->orderBy('name', 'asc')->get();
    }

    public static function criar($request)
    {
        Permissao::proteger('owners.manage');
        $dados = $request->getPostVars();
        $name = trim((string) ($dados['name'] ?? ''));

        if ($name === '') {
            return ['erro' => 1, 'mensagem' => 'Informe o nome do proprietário.'];
        }

        if (Owner::where('name', $name)->exists()) {
            return ['erro' => 1, 'mensagem' => 'Já existe um proprietário com este nome.'];
        }

        try {
            $owner = Owner::create([
                'name' => $name,
                'ons_name' => self::nullableString($dados['ons_name'] ?? null),
                'ons_ftp_folder' => self::nullableString($dados['ons_ftp_folder'] ?? null),
                'enabled' => self::booleanValue($dados['enabled'] ?? true),
            ]);
        } catch (\Throwable $exception) {
            if (self::isDuplicateException($exception)) {
                return ['erro' => 1, 'mensagem' => 'Já existe um proprietário com este nome.'];
            }
            throw $exception;
        }

        return ['erro' => 0, 'mensagem' => 'Proprietário criado com sucesso.', 'data' => $owner];
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('owners.manage');
        $owner = Owner::where('id', $id)->first();
        if (!$owner) {
            return ['erro' => 1, 'mensagem' => 'Proprietário não encontrado.'];
        }

        $dados = $request->getPostVars();
        $name = trim((string) ($dados['name'] ?? ''));
        if ($name === '') {
            return ['erro' => 1, 'mensagem' => 'Informe o nome do proprietário.'];
        }

        if (Owner::where('name', $name)->where('id', '<>', $id)->exists()) {
            return ['erro' => 1, 'mensagem' => 'Já existe outro proprietário com este nome.'];
        }

        try {
            $owner->update([
                'name' => $name,
                'ons_name' => self::nullableString($dados['ons_name'] ?? null),
                'ons_ftp_folder' => self::nullableString($dados['ons_ftp_folder'] ?? null),
                'enabled' => self::booleanValue($dados['enabled'] ?? $owner->enabled),
            ]);
        } catch (\Throwable $exception) {
            if (self::isDuplicateException($exception)) {
                return ['erro' => 1, 'mensagem' => 'Já existe outro proprietário com este nome.'];
            }
            throw $exception;
        }

        return ['erro' => 0, 'mensagem' => 'Proprietário atualizado com sucesso.', 'data' => $owner];
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('owners.manage');
        $owner = Owner::where('id', $id)->first();
        if (!$owner) {
            return ['erro' => 1, 'mensagem' => 'Proprietário não encontrado.'];
        }

        $dados = $request->getPostVars();
        if (!array_key_exists('enabled', $dados)) {
            return ['erro' => 1, 'mensagem' => 'Informe o novo status do proprietário.'];
        }

        $owner->update(['enabled' => self::booleanValue($dados['enabled'])]);

        return ['erro' => 0, 'mensagem' => 'Status do proprietário atualizado com sucesso.', 'data' => $owner];
    }

    private static function nullableString($value)
    {
        $value = trim((string) ($value ?? ''));
        return $value === '' ? null : $value;
    }

    private static function booleanValue($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1);
    }

    private static function isDuplicateException(\Throwable $exception): bool
    {
        return strpos(strtolower($exception->getMessage()), 'duplicate') !== false
            || strpos(strtolower($exception->getMessage()), 'unique') !== false;
    }
}
