<?php

namespace OrigemPHP\Servicos\Usuarios;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;

class UsuariosApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('users.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));

        $query = DB::table('users')->select(
            'users.id',
            'users.name',
            'users.email',
            'users.enabled',
            'users.last_login_at',
            'users.created_at',
            'users.updated_at'
        );

        if (!empty(trim((string) ($params['search'] ?? '')))) {
            $search = '%' . trim($params['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'ilike', $search)
                    ->orWhere('users.email', 'ilike', $search);
            });
        }

        if (array_key_exists('enabled', $params) && $params['enabled'] !== '') {
            $query->where('users.enabled', self::booleanValue($params['enabled']));
        }

        if (!empty($params['role_id'])) {
            $roleId = $params['role_id'];
            $query->whereIn('users.id', function ($q) use ($roleId) {
                $q->from('user_roles')->where('role_id', $roleId)->select('user_id');
            });
        } elseif (!empty($params['role'])) {
            $roleSlug = $params['role'];
            $query->whereIn('users.id', function ($q) use ($roleSlug) {
                $q->from('user_roles')
                    ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                    ->where('roles.slug', $roleSlug)
                    ->select('user_roles.user_id');
            });
        }

        $total = (clone $query)->count();
        $ativos = (clone $query)->where('users.enabled', true)->count();
        $inativos = (clone $query)->where('users.enabled', false)->count();
        $sortFields = ['name' => 'users.name', 'email' => 'users.email', 'created_at' => 'users.created_at', 'last_login_at' => 'users.last_login_at'];
        $sort = $sortFields[$params['sort'] ?? ''] ?? 'users.name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->paginate($perPage, ['*'], 'page', $page);
        $items = $pagination->items();

        $rolesByUser = [];
        $ids = array_map(function ($item) {
            return $item->id;
        }, $items);
        if ($ids) {
            $roleRows = DB::table('user_roles')
                ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                ->whereIn('user_roles.user_id', $ids)
                ->select('user_roles.user_id', 'roles.id', 'roles.name', 'roles.slug')
                ->orderBy('roles.name')
                ->get();
            foreach ($roleRows as $role) {
                $rolesByUser[$role->user_id][] = [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                ];
            }
        }

        foreach ($items as $item) {
            $item->roles = $rolesByUser[$item->id] ?? [];
            $item->role_names = array_map(function ($role) {
                return $role['name'];
            }, $item->roles);
            $item->role_slugs = array_map(function ($role) {
                return $role['slug'];
            }, $item->roles);
        }

        return [
            'data' => $items,
            'current_page' => $pagination->currentPage(),
            'last_page' => $pagination->lastPage(),
            'per_page' => $pagination->perPage(),
            'total' => $total,
            'from' => $pagination->firstItem(),
            'to' => $pagination->lastItem(),
            'ativos' => $ativos,
            'inativos' => $inativos,
        ];
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('users.view');
        $user = self::find($id);
        return $user ? self::withRoles($user) : ['erro' => 1, 'mensagem' => 'Usuário não encontrado.'];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('users.view');
        return DB::table('users')->select('id', 'name', 'email', 'enabled')->where('enabled', true)->orderBy('name')->get();
    }

    public static function rolesSimples($request)
    {
        Permissao::proteger('users.view');
        return DB::table('roles')->select('id', 'name', 'slug')->where('enabled', true)->orderBy('name')->get();
    }

    public static function criar($request)
    {
        Permissao::proteger('users.manage');
        $data = self::data($request);
        $error = self::validate($data, true);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];

        try {
            return DB::transaction(function () use ($data) {
                $now = date('Y-m-d H:i:s');
                $id = DB::table('users')->insertGetId([
                    'name' => trim($data['name']),
                    'email' => trim($data['email']),
                    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
                    'enabled' => self::booleanValue($data['enabled'] ?? true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                self::syncRoles($id, $data['role_ids']);
                return ['erro' => 0, 'mensagem' => 'Usuário criado com sucesso.', 'data' => self::withRoles(self::find($id))];
            });
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Este e-mail já está cadastrado.' : 'Não foi possível criar o usuário.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('users.manage');
        $user = self::find($id);
        if (!$user)
            return ['erro' => 1, 'mensagem' => 'Usuário não encontrado.'];
        $data = self::data($request);
        $error = self::validate($data, false, $id);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];

        try {
            return DB::transaction(function () use ($data, $id, $user) {
                $roleIds = self::roleIds($data['role_ids']);
                $enabled = self::booleanValue($data['enabled'] ?? $user->enabled);
                if (!$enabled && (int) ($_SESSION['users']['id'] ?? 0) === (int) $id) {
                    return ['erro' => 1, 'mensagem' => 'Você não pode desativar o próprio usuário.'];
                }
                if (!$enabled && self::hasAdminRole($user->id) && self::isLastActiveAdmin($id)) {
                    return ['erro' => 1, 'mensagem' => 'O sistema deve possuir pelo menos um administrador ativo.'];
                }
                $removesAdmin = self::hasAdminRole($user->id) && !self::containsAdmin($roleIds);
                if ($removesAdmin && self::isLastActiveAdmin($id)) {
                    return ['erro' => 1, 'mensagem' => 'O sistema deve possuir pelo menos um administrador ativo.'];
                }
                $update = [
                    'name' => trim($data['name']),
                    'email' => trim($data['email']),
                    'enabled' => $enabled,
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                if (!empty($data['password']))
                    $update['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
                DB::table('users')->where('id', $id)->update($update);
                self::syncRoles($id, $roleIds);
                return ['erro' => 0, 'mensagem' => 'Usuário atualizado com sucesso.', 'data' => self::withRoles(self::find($id))];
            });
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Este e-mail já está cadastrado.' : 'Não foi possível atualizar o usuário.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('users.manage');
        $user = self::find($id);
        if (!$user)
            return [
                'erro' => 1,
                'mensagem' => 'Usuário não encontrado.'
            ];

        $data = self::data($request);

       
        $enabled = self::booleanValue($data['enabled'] ?? null);
        if (!$enabled && (int) ($_SESSION['users']['id'] ?? 0) === (int) $id)
            return [
                'erro' => 1,
                'mensagem' => 'Você não pode desativar o próprio usuário.'
            ];

        if (!$enabled && self::hasAdminRole($id) && self::isLastActiveAdmin($id))
            return [
                'erro' => 1,
                'mensagem' => 'O sistema deve possuir pelo menos um administrador ativo.'
            ];

        DB::table('users')
            ->where('id', $id)
            ->update([
                'enabled' => $enabled,
                'updated_at' => date('Y-m-d H:i:s')
            ]);

        return [
            'erro' => 0,
            'mensagem' =>
                'Status do usuário atualizado com sucesso.',
            'data' => self::withRoles(self::find($id))
        ];

    }

    public static function alterarSenha($request, $id)
    {
        Permissao::proteger('users.manage');
        if (!self::find($id))
            return [
                'erro' => 1,
                'mensagem' => 'Usuário não encontrado.'
            ];
        $data = self::data($request);
        if (empty($data['password']))
            return [
                'erro' => 1,
                'mensagem' => 'Informe a nova senha.'
            ];
        if ($data['password'] !== ($data['password_confirmation'] ?? ''))
            return [
                'erro' => 1,
                'mensagem' => 'A confirmação da senha não confere.'
            ];
        DB::table('users')->where('id', $id)->update(['password' => password_hash($data['password'], PASSWORD_DEFAULT), 'updated_at' => date('Y-m-d H:i:s')]);
        return [
            'erro' => 0,
            'mensagem' => 'Senha alterada com sucesso.'
        ];
    }

    private static function find($id)
    {
        return DB::table('users')
            ->select('id', 'name', 'email', 'enabled', 'last_login_at', 'created_at', 'updated_at')
            ->where('id', $id)
            ->first();
    }

    private static function withRoles($user)
    {
        if (!$user)
            return null;
        $user->roles = DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('user_roles.user_id', $user->id)
            ->select('roles.id', 'roles.name', 'roles.slug')
            ->get();
        return $user;
    }

    private static function data($request): array
    {
        return $request->getPostVars();
    }

    private static function validate(array $data, bool $creating, $id = null)
    {
        if (trim((string) ($data['name'] ?? '')) === ''){
            return 'Informe o nome do usuário.';
        }
        $email = trim((string) ($data['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Informe um e-mail válido.';
        }

        $exists = DB::table('users')
            ->where('email', $email)
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })->exists();

        if ($exists) {
            return 'Este e-mail já está cadastrado.';
        }

        if ($creating && empty($data['password'])) {
            return 'Informe a senha.';
        }

        if (!empty($data['password']) && $data['password'] !== ($data['password_confirmation'] ?? '')) {
            return 'A confirmação da senha não confere.';
        }

        $roles = $data['role_ids'] ?? $data['roles'] ?? [];
        if (!is_array($roles) || !$roles) {
            return 'Selecione pelo menos um perfil.';
        }

        try {
            self::roleIds($roles);
        } catch (\InvalidArgumentException $e) {
            return $e->getMessage();
        }
        return null;
    }

    private static function roleIds(array $roleIds): array
    {
        $ids = array_values(array_unique(array_map('intval', $roleIds)));
        if (!$ids || DB::table('roles')->whereIn('id', $ids)->where('enabled', true)->count() !== count($ids))
            throw new \InvalidArgumentException('Um ou mais perfis são inválidos ou estão inativos.');
        return $ids;
    }

    private static function syncRoles($userId, array $roleIds): void
    {
        $roleIds = self::roleIds($roleIds);
        DB::table('user_roles')->where('user_id', $userId)->whereNotIn('role_id', $roleIds)->delete();
        foreach ($roleIds as $roleId) {
            if (!DB::table('user_roles')->where('user_id', $userId)->where('role_id', $roleId)->exists())
                DB::table('user_roles')->insert(['user_id' => $userId, 'role_id' => $roleId, 'created_at' => date('Y-m-d H:i:s')]);
        }
    }

    private static function hasAdminRole($userId): bool
    {
        return DB::table('user_roles')->join('roles', 'user_roles.role_id', '=', 'roles.id')->where('user_roles.user_id', $userId)->where('roles.slug', 'administrador')->exists();
    }

    private static function containsAdmin(array $roleIds): bool
    {
        return DB::table('roles')->whereIn('id', $roleIds)->where('slug', 'administrador')->where('enabled', true)->exists();
    }

    private static function isLastActiveAdmin($userId): bool
    {
        return DB::table('users')->join('user_roles', 'users.id', '=', 'user_roles.user_id')->join('roles', 'user_roles.role_id', '=', 'roles.id')->where('users.enabled', true)->where('roles.enabled', true)->where('roles.slug', 'administrador')->where('users.id', '<>', $userId)->count() === 0;
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
