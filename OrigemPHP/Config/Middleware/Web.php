<?php

namespace OrigemPHP\Config\Middleware;
use OrigemPHP\Config\Connection;
use \Firebase\JWT\JWT;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Facades\Route;
use OrigemPHP\Config\BaseController;

class Web extends BaseController
{
    private function getUsers()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (empty($_SESSION['users'])) {
            header('Location: /login');
            exit;
        }

        return $_SESSION['users'];
    }


    private function webauth($request)
    {

        if ($user = $this->getUsers()) {
            $request->user = $user;
            return true;
        }

        throw new \Exception("Token inválido web", 403);
    }

    public function handle($request, $next, $parms1)
    {
        $this->webauth($request);
        return $next($request);
    }

}