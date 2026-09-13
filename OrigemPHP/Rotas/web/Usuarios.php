<?php


namespace OrigemPHP\Rotas\web;

use OrigemPHP\Servicos\Auth;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Autentica;
use OrigemPHP\Servicos\Login\LoginUser;
use OrigemPHP\Servicos\Usuarios\Usuarios;


$obRouter->get('/usuarios', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Usuarios::listar_usuario_e_pessoas($request), 'text/html');
    }
]);




