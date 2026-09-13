<?php


namespace OrigemPHP\Rotas\api;

use OrigemPHP\Servicos\Auth;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Autentica;
use OrigemPHP\Servicos\Home\Home;



use OrigemPHP\Servicos\Usuarios\Usuarios;


$obRouter->get('/user/listar-usuario-id/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, Usuarios::listar_usuarioId($request, $id), 'application/json');
    }
]);

$obRouter->get('/user/listar-usuario-pessoa-id/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, Usuarios::listar_usuario_id_pessoas($request, $id), 'application/json');
    }
]);

$obRouter->get('/user/deletar-usuario/{id}', [
    'middlewares' => ['Api'],
    function($id){
        return new Response(200, Usuarios::deletar_usuario($id), 'application/json');
    }
]);

$obRouter->post('/user/cadastrar-salvar', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Usuarios::cadastrar_salvar($request), 'application/json');
    }
]);


$obRouter->post('/user/atualizar-salvar', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Usuarios::atualizar_salvar($request), 'application/json');
    }
]);



$obRouter->get('/home-panel-informacoes', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, Home::informacoes($request), 'application/json');
    }
]);