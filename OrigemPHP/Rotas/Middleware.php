<?php 



namespace OrigemPHP\Rotas;



\OrigemPHP\Config\Middleware\Queue::setMap([
    'maintenence'    => \OrigemPHP\Config\Middleware\Maintenance::class,
    'Api'            => \OrigemPHP\Config\Middleware\Api::class,
    'jwt-auth'       => \OrigemPHP\Config\Middleware\JwtAuth::class,
    'Permissao'      => \OrigemPHP\Config\Middleware\Permissao::class,
    'Web'            => \OrigemPHP\Config\Middleware\Web::class,
    'Token'          => \OrigemPHP\Config\Middleware\Token::class,
    
]);

\OrigemPHP\Config\Middleware\Queue::setDefault([
    'maintenence'
]);