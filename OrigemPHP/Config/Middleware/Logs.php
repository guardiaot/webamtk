<?php

namespace OrigemPHP\Config\Middleware;
use OrigemPHP\Config\Connection;
use \Firebase\JWT\JWT;

class Logs extends Connection
{
    public function handle($request, $next, $parms1)
    {
        $request->getRouter()->setContentType('application/json; charset=utf-8');
        return $next($request);
    }
}