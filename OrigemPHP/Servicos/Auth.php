<?php

namespace OrigemPHP\Servicos;

use OrigemPHP\Config\Connection;
use Firebase\JWT\JWT as JWT;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Config\BaseModelEloquent;
use OrigemPHP\Servicos\Audit\UserActivityLogger;

class Auth extends BaseController
{
    private static $box = 'user';

    public static function login($request)
    {


        $dados = $request->getPostVars();
        $email  = trim($dados['email'] ?? '');
        $password = $dados['password'] ?? '';


        $userFound = DB::table('users')
            ->where('email', $email)
            ->first();

        //    dd($userFound);

        if (!$userFound || !(bool) $userFound->enabled) {
            throw new \Exception("Usuario ou senha invalida!", 200);
        }

        if (!password_verify($password, $userFound->password)) {
            throw new \Exception("Usuario ou senha invalida!", 200);
        }

        $payload = [
            'sub' => (string) $userFound->id,
            'email' => $userFound->email,
            'iat' => time(),
            'exp' => time() + (8 * 60 * 60),
        ];

        $token = JWT::encode($payload, 'Ksis-seguros', 'HS256');

        DB::table('users')
            ->where('id', "=", $userFound->id)
            ->update([
                'access_token' => $token,
                'last_login_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);

        $roles = DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('user_roles.user_id', $userFound->id)
            ->where('roles.enabled', true)
            ->pluck('roles.slug')
            ->toArray();

        $permissions = DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->join('role_permissions', 'roles.id', '=', 'role_permissions.role_id')
            ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
            ->where('user_roles.user_id', $userFound->id)
            ->where('roles.enabled', true)
            ->where('permissions.enabled', true)
            ->distinct()
            ->pluck('permissions.slug')
            ->toArray();


        $result = [
            'id' => $userFound->id,
            'name' => $userFound->name,
            'nome' => $userFound->name,
            'email' => $userFound->email,
            'roles' => array_values(array_unique($roles)),
            'permissions' => array_values(array_unique($permissions)),
            'access_token' => $token,
        ];

        Auth::setSession($result);
        UserActivityLogger::registrar('LOGIN', 'AUTH', 'Usuário realizou login.', 'user', $userFound->id);
        return $result;
    }

    public static function setSession($data)
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        @$_SESSION['users'] = $data;
    }

    public static function base64KsiEncode($data)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}
