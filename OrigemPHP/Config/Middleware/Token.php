<?php

namespace OrigemPHP\Config\Middleware;

use PDO;
use \Firebase\JWT\JWT;
use OrigemPHP\Config\Helpers;
use OrigemPHP\Config\Connection;


use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

use OrigemPHP\Config\BaseController;

class Token extends BaseController
{
    public function getToken($request)
    {

        $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? null;
        $corretorKey = $_SERVER['HTTP_X_CLIENT_ID'] ?? null;
        $userChave = $_SERVER['HTTP_X_USER_ID'] ?? null;

        if (!$apiKey) {
            throw new \Exception("API Key não encontrada!", 403);
        }

        $token = DB::table('api_clientes')
            ->where('token', '=', $apiKey)
            ->first();

        if (!$token) {
            throw new \Exception("Token inválido ou não encontrado!", 403);
        }

        if (!$corretorKey) {
            throw new \Exception("Código do corretor não encontrado!", 403);
        }

        $corretor = DB::table("corretor")
            ->select("id_externo", "id_imobiliaria", "flag_nivel_acesso", "nome", "chave", "site")
            ->where("id_externo", "=", $corretorKey)
            ->where("chave",'=', $userChave)
            ->first();

        if (!$corretor) {
            throw new \Exception("Código do corretor inválido ou não encontrado!", 403);
        }

        if (!$userChave) {
            throw new \Exception("User ID não encontrado!", 403);
        }

    }

    public function handle($request, $next)
    {
        $this->getToken($request);
        return $next($request);
    }
}
