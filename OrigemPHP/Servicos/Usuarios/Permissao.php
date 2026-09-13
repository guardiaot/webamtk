<?php

namespace OrigemPHP\Servicos\Usuarios;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;

class Permissao extends BaseController
{
    public static function hasPermission($permissionSlug)
    {
        $users = $_SESSION['users'] ?? [];
        return in_array($permissionSlug, $users['permissions'] ?? [], true);
    }

    public static function hasRole($roleSlug)
    {
        $users = $_SESSION['users'] ?? [];
        return in_array($roleSlug, $users['roles'] ?? [], true);
    }

    public static function proteger($permissionSlug)
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (empty($_SESSION['users']['id'])) {
            throw new \Exception('Usuário não autenticado.', 401);
        }

        if (!self::hasPermission($permissionSlug)) {
            throw new \Exception('Acesso negado!', 403);
        }

        return true;
    }

    public static function getPermissoes($userId)
    {
        return DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->join('role_permissions', 'roles.id', '=', 'role_permissions.role_id')
            ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
            ->where('user_roles.user_id', $userId)
            ->where('roles.enabled', true)
            ->where('permissions.enabled', true)
            ->distinct()
            ->pluck('permissions.slug')
            ->toArray();
    }

    public static function podeAcessar($userId, $menuId)
    {
        return false;
    }

    public static function pode($userId, $menuId, $acao)
    {
        return false;
    }
}
