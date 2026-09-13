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

class Permissao extends BaseController
{

    private function getJwtAuth($request, $params)
    {
        $headers = $request->getHeaders();
        $jwt = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';        

        try {
            $decode = (array) JWT::decode($jwt, 'Ksis-seguros', ['HS256']);
        } catch (\Exception $e) {
            throw new \Exception("Token inválido", 403);            
        }

        $email = $decode['email'];
        $userFound =  DB::table('users')
        ->where('email', $email)
        ->get();

       
        return $userFound;
        
    }

    private function auth($request, $params)
    {
        if ($user = $this->getJwtAuth($request, $params)) {
            $request->user = $user;
            return true;
        }

        throw new \Exception("Token inválido", 403);        
    }

    public function handle($request, $next, $params )
    {
       $this->auth($request, $params);
       return $next($request);
    }

   
}