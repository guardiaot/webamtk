<?php



namespace OrigemPHP\Rotas;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Auth;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Autentica;
use OrigemPHP\Servicos\IED\Ieds;

$obRouter->get('/login', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Autentica::login($request), 'text/html');
    }
]);


$obRouter->post('/api/Auth/logar', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(201, Auth::login($request), 'application/json');
    }
]);




$obRouter->post('/save/ied', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Ieds::sava($request), 'text/html');
    }
]);
