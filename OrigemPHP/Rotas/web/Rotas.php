<?php


namespace OrigemPHP\Rotas\web;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Autentica;

use OrigemPHP\Servicos\Events\Events;
use OrigemPHP\Servicos\Home\Home;
use OrigemPHP\Servicos\IED\Ieds;
use OrigemPHP\Servicos\Oscillography\Oscillography;
use OrigemPHP\Servicos\FaultLocations\FaultLocations;
use OrigemPHP\Servicos\FaultLocations\FaultLocationFiles;
use OrigemPHP\Servicos\Monitoring\Monitoring;
use OrigemPHP\Servicos\Maintenance\Server;
use OrigemPHP\Servicos\Maintenance\Triggers;
use OrigemPHP\Servicos\Maintenance\Upload;
use OrigemPHP\Servicos\Comtrade\Comtrade;
use OrigemPHP\Servicos\Oscillography\OscillographyApi;
use OrigemPHP\Servicos\Settings\Settings;
use OrigemPHP\Servicos\Audit\UserActivities;
use OrigemPHP\Servicos\Logs\SystemLogs;
use OrigemPHP\Servicos\Telemetry\History;
use OrigemPHP\Servicos\Telemetry\Telemetry;

$obRouter->get('/', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Home::Home($request), 'text/html');
    }
]);



$obRouter->get('/login', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, Autentica::login($request), 'text/html');
    }
]);


$obRouter->get('/home', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Home::Home($request), 'text/html');
    }
]);

$obRouter->get('/ieds', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        $response = new Response(302, '', 'text/html');
        $response->addHeader('Location', '/settings/ieds');
        return $response;
    }
]);

$obRouter->get('/ieds/{id}', [
    'middlewares' => ['Api', 'Web'],
    function ($request, $id) {
        return new Response(
            200,
            Ieds::detalhe($request, $id),
            'text/html'
        );
    }
]);


$obRouter->get('/telemetry', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Telemetry::Telemetry($request), 'text/html');
    }
]);


$obRouter->get('/telemetry/history', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, History::historico($request), 'text/html');
    }
]);



$obRouter->get('/events', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Events::eventos($request), 'text/html');
    }
]);

$obRouter->get('/oscillography', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Oscillography::index($request), 'text/html');
    }
]);

$obRouter->get('/fault-locations', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, FaultLocations::index($request), 'text/html');
    }
]);

$obRouter->get('/fault-locations/{id}', [
    'middlewares' => ['Api', 'Web'],
    function ($request, $id) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, FaultLocations::detalhe($request, $id), 'text/html');
    }
]);

$obRouter->get('/fault-location-files', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, FaultLocationFiles::index($request), 'text/html');
    }
]);

$obRouter->get('/maintenance/monitoring', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Monitoring::index($request), 'text/html');
    }
]);

$obRouter->get('/maintenance/server', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Server::index($request), 'text/html');
    }
]);

$obRouter->get('/maintenance/triggers', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Triggers::index($request), 'text/html');
    }
]);

$obRouter->get('/maintenance/upload', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Upload::index($request), 'text/html');
    }
]);

$obRouter->get('/comtrade', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, Comtrade::index($request), 'text/html');
    }
]);

$obRouter->get('/comtrade/{id}', [
    'middlewares' => ['Api', 'Web'],
    function ($request, $id) {
        return new Response(200, Comtrade::detalhe($request, $id), 'text/html');
    }
]);


$obRouter->get('/settings/ieds', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Settings::ieds($request), 'text/html');
    }
]);

$obRouter->get('/settings/agents', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Settings::agents($request), 'text/html');
    }
]);

$obRouter->get('/settings/owners', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Settings::owners($request), 'text/html');
    }
]);

$obRouter->get('/settings/users', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Settings::users($request), 'text/html');
    }
]);

$obRouter->get('/settings/regionals', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::regionals($request), 'text/html');
    }
]);

$obRouter->get('/settings/installations', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::installations($request), 'text/html');
    }
]);

$obRouter->get('/settings/transmission-function-types', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::transmissionFunctionTypes($request), 'text/html');
    }
]);

$obRouter->get('/settings/ied-types', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::iedTypes($request), 'text/html');
    }
]);

$obRouter->get('/settings/ied-templates', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::iedTemplates($request), 'text/html');
    }
]);

$obRouter->get('/settings/collection-drivers', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::collectionDrivers($request), 'text/html');
    }
]);

$obRouter->get('/settings/message-types', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::messageTypes($request), 'text/html');
    }
]);

$obRouter->get('/settings/transmission-functions', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];
        return new Response(200, Settings::transmissionFunctions($request), 'text/html');
    }
]);

$obRouter->get('/settings/system', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Settings::system($request), 'text/html');
    }
]);

$obRouter->get('/system/user-activities', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, UserActivities::index($request), 'text/html');
    }
]);

$obRouter->get('/system/logs', [
    'middlewares' => ['Api', 'Web'],
    function ($request) {
        return new Response(200, SystemLogs::index($request), 'text/html');
    }
]);

/*
 * ============================================================
 * MIGRAÇÃO - Criar tabelas
 * ============================================================
 */
$obRouter->get('/criar-tabelas', [
    'middlewares' => ['Api'],
    function ($request) {
        require_once __DIR__ . '/../../Servicos/Database/CreateTables.php';
        return new Response(200, 'Tabelas criadas com sucesso!', 'text/html');
    }
]);



$obRouter->get('/oscillography/{id}', [
    'middlewares' => ['Api', 'Web'],
    function ($request, $id) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Oscillography::comtradeId($request, $id), 'text/html');
    }
]);




/*
$obRouter->get('/seguradora/produtos/novo/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, Seguradora::novoProduto($request, $id), 'text/html');
    }
]);


$obRouter->post('/seguradora/salvar', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, SeguradoraSalvar::savalvarCadastrar($request), 'text/html');
    }
]);
*/

