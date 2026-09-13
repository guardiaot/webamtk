<?php


namespace OrigemPHP\Rotas\api;

use OrigemPHP\Servicos\Auth;
use OrigemPHP\Config\Response;
use OrigemPHP\Servicos\Autentica;
use OrigemPHP\Servicos\Home\Home;
use OrigemPHP\Servicos\IED\Ieds;
use OrigemPHP\Servicos\IED\IedsApi;
use OrigemPHP\Servicos\Telemetry\History;
use OrigemPHP\Servicos\Telemetry\Telemetry;
use OrigemPHP\Servicos\Events\EventsApi;
use OrigemPHP\Servicos\Agents\AgentsApi;
use OrigemPHP\Servicos\Owners\OwnersApi;
use OrigemPHP\Servicos\Comtrade\ComtradeApi;
use OrigemPHP\Servicos\Comtrade\ComtradeFilesApi;
use OrigemPHP\Servicos\Oscillography\OscillographyApi;
use OrigemPHP\Servicos\Settings\SettingsApi;
use OrigemPHP\Servicos\Usuarios\UsuariosApi;
use OrigemPHP\Servicos\Regionals\RegionalsApi;
use OrigemPHP\Servicos\Installations\InstallationsApi;
use OrigemPHP\Servicos\States\StatesApi;
use OrigemPHP\Servicos\TransmissionFunctionTypes\TransmissionFunctionTypesApi;
use OrigemPHP\Servicos\TransmissionFunctions\TransmissionFunctionsApi;
use OrigemPHP\Servicos\IEDTypes\IEDTypesApi;
use OrigemPHP\Servicos\IEDTemplates\IEDTemplatesApi;
use OrigemPHP\Servicos\CollectionDrivers\CollectionDriversApi;
use OrigemPHP\Servicos\MessageTypes\MessageTypesApi;
use OrigemPHP\Servicos\FaultLocations\FaultLocationsApi;
use OrigemPHP\Servicos\FaultLocations\FaultLocationFilesApi;
use OrigemPHP\Servicos\Monitoring\MonitoringApi;
use OrigemPHP\Servicos\Maintenance\ServerApi;
use OrigemPHP\Servicos\Maintenance\TriggersApi;
use OrigemPHP\Servicos\Audit\UserActivitiesApi;
use OrigemPHP\Servicos\Logs\SystemLogsApi;
use OrigemPHP\Servicos\Maintenance\UploadApi;
use OrigemPHP\Servicos\ChannelMapping\ChannelMappingApi;

$obRouter->get('/home-panel-informacoes', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(
            200,
           Home::informacoes($request),
            'application/json'
        );
    }
]);



$obRouter->get('/lista/ieds', [
    'middlewares' => ['Api'],
    function($request){
        session_start();
        $users = @$_SESSION['users'];
      
        return new Response(200, Ieds::listaIeds($request), 'application/json');
    }
]);


///telemetry/ieds

$obRouter->get('/telemetry/ieds', [
    'middlewares' => ['Api'],
    function($request){
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, Telemetry::ieds($request), 'application/json');
    }
]);

$obRouter->get('/telemetry/ultimas', [
    'middlewares' => ['Api'],
    function($request){
        session_start();
        $users = @$_SESSION['users'];
      
        return new Response(200, Telemetry::ultimas($request), 'application/json');
    }
]);

$obRouter->get('/telemetry/listar', [
    'middlewares' => ['Api'],
    function($request){
        session_start();
        $users = @$_SESSION['users'];
      
        return new Response(200, Telemetry::listar($request), 'application/json');
    }
]);

$obRouter->get('/telemetry/ultima/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        session_start();
        $users = @$_SESSION['users'];
      
        return new Response(200, Telemetry::ultimaPorIed($request, $id), 'application/json');
    }
]);



$obRouter->get('/telemetry/history/ied/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        session_start();
        $users = @$_SESSION['users'];
      
        return new Response(200,  History::historicoIed($request, $id), 'application/json');
    }
]);


$obRouter->get('/telemetry/history/ied', [
    'middlewares' => ['Api'],
    function($request, $id){
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200,  History::historicoData($request, $id), 'application/json');
    }
]);


/*
 * ============================================================
 * EVENTS API
 * ============================================================
 */

$obRouter->get('/api/v1/events', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, EventsApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/events/resumo', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, EventsApi::resumo($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/user-activities', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, UserActivitiesApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/system-logs', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, SystemLogsApi::listar($request), 'application/json');
    }
]);


/*
 * ============================================================
 * FAULT LOCATIONS API
 * ============================================================
 */

$obRouter->get('/api/v1/fault-locations', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, FaultLocationsApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/fault-locations/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, FaultLocationsApi::detalhe($request, $id), 'application/json');
    }
]);

$obRouter->get('/api/v1/fault-location-files', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, FaultLocationFilesApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/monitoring', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, MonitoringApi::resumo($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/maintenance/server', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, ServerApi::resumo($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/maintenance/triggers', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, TriggersApi::listar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/maintenance/upload', [
    'middlewares' => ['Api'],
    function($request){
        return UploadApi::importar($request);
    }
]);


/*
 * ============================================================
 * IED UPDATE / DELETE
 * ============================================================
 */

$obRouter->get('/api/v1/ieds', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, IedsApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/ieds/simples', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, IedsApi::listarSimples($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/ieds/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, IedsApi::visualizar($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/ieds', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, IedsApi::criar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/ieds/{id}/update', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, IedsApi::atualizar($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/ieds/{id}/delete', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, Ieds::excluir($request, $id), 'application/json');
    }
]);


/*
 * ============================================================
 * AGENTS API
 * ============================================================
 */

$obRouter->get('/api/v1/agents', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, AgentsApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/agents/simples', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, AgentsApi::listarSimples($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/agents', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, AgentsApi::criar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/agents/{id}/update', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, AgentsApi::atualizar($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/agents/{id}/delete', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, AgentsApi::excluir($request, $id), 'application/json');
    }
]);

/*
 * ============================================================
 * OWNERS API
 * ============================================================
 */

$obRouter->get('/api/v1/owners', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, OwnersApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/owners/simples', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, OwnersApi::listarSimples($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/owners', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, OwnersApi::criar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/owners/{id}/update', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, OwnersApi::atualizar($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/owners/{id}/status', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, OwnersApi::alterarStatus($request, $id), 'application/json');
    }
]);


/*
 * ============================================================
 * COMTRADE API
 * ============================================================
 */

$obRouter->get('/api/v1/comtrade', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, ComtradeApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/comtrade/resumo', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, ComtradeApi::resumo($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/comtrade/{recordId}/files/{type}', [
    'middlewares' => ['Api'],
    function($request, $recordId, $type){
        return ComtradeFilesApi::download($request, $recordId, $type);
    }
]);

$obRouter->get('/api/v1/comtrade/{id}', [
    'middlewares' => ['Api'],
    function($request, $id){
        return new Response(200, ComtradeApi::detalhe($request, $id), 'application/json');
    }
]);



$obRouter->get('/api/v1/visualizar/{id}/comtrade', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, OscillographyApi::visualizar($request, $id), 'application/json');
    }
]);

$obRouter->get('/api/v1/samples/{id}/comtrade', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        session_start();
        $users = @$_SESSION['users'];

        return new Response(200, OscillographyApi::samples($request, $id), 'application/json');
    }
]);

/*
 * ============================================================
 * OSCILOGRAPHY API
 * ============================================================
 */

$obRouter->get('/api/v1/oscillography', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, OscillographyApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/oscillography/resumo', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, OscillographyApi::resumo($request), 'application/json');
    }
]);


/*
 * ============================================================
 * IED TYPES API
 * ============================================================
 */

$obRouter->get('/api/v1/ied-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTypesApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/channel-mappings/context/{comtradeRecordId}', [
    'middlewares' => ['Api'],
    function ($request, $comtradeRecordId) {
        return new Response(200, ChannelMappingApi::context($request, $comtradeRecordId), 'application/json');
    }
]);

$obRouter->get('/api/v1/channel-mappings/profile/{profileId}', [
    'middlewares' => ['Api'],
    function ($request, $profileId) {
        return new Response(200, ChannelMappingApi::profile($request, $profileId), 'application/json');
    }
]);

$obRouter->post('/api/v1/channel-mappings/profile', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, ChannelMappingApi::createProfile($request), 'application/json');
    }
]);

$obRouter->put('/api/v1/channel-mappings/profile/{profileId}', [
    'middlewares' => ['Api'],
    function ($request, $profileId) {
        return new Response(200, ChannelMappingApi::update($request, $profileId), 'application/json');
    }
]);

$obRouter->post('/api/v1/channel-mappings/profile/{profileId}/confirm', [
    'middlewares' => ['Api'],
    function ($request, $profileId) {
        return new Response(200, ChannelMappingApi::confirm($request, $profileId), 'application/json');
    }
]);

$obRouter->post('/api/v1/channel-mappings/profile/{profileId}/invalidate', [
    'middlewares' => ['Api'],
    function ($request, $profileId) {
        return new Response(200, ChannelMappingApi::invalidate($request, $profileId), 'application/json');
    }
]);

$obRouter->get('/api/v1/ied-types/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTypesApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/ied-types/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTypesApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTypesApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-types/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTypesApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-types/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTypesApi::alterarStatus($request, $id), 'application/json'); }
]);

/*
 * ============================================================
 * SETTINGS API
 * ============================================================
 */

$obRouter->get('/api/v1/collection-drivers', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, CollectionDriversApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/collection-drivers/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, CollectionDriversApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/collection-drivers/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, CollectionDriversApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/collection-drivers', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, CollectionDriversApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/collection-drivers/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, CollectionDriversApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/collection-drivers/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, CollectionDriversApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/message-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, MessageTypesApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/message-types/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, MessageTypesApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/message-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, MessageTypesApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/message-types/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, MessageTypesApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/message-types/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, MessageTypesApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/ied-templates', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTemplatesApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/ied-templates/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTemplatesApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/ied-templates/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTemplatesApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-templates', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, IEDTemplatesApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-templates/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTemplatesApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/ied-templates/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, IEDTemplatesApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/regionals', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, RegionalsApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/regionals/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, RegionalsApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/regionals/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, RegionalsApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/regionals', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, RegionalsApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/regionals/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, RegionalsApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/regionals/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, RegionalsApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/installations', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, InstallationsApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/installations/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, InstallationsApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/installations/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, InstallationsApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/installations', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, InstallationsApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/installations/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, InstallationsApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/installations/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, InstallationsApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/states/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, StatesApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-function-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionTypesApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-function-types/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionTypesApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-function-types/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionTypesApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-function-types', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionTypesApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-function-types/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionTypesApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-function-types/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionTypesApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-functions', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionsApi::listar($request), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-functions/simples', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionsApi::listarSimples($request), 'application/json'); }
]);

$obRouter->get('/api/v1/transmission-functions/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionsApi::listarPorId($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-functions', [
    'middlewares' => ['Api'],
    function ($request) { return new Response(200, TransmissionFunctionsApi::criar($request), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-functions/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionsApi::atualizar($request, $id), 'application/json'); }
]);

$obRouter->post('/api/v1/transmission-functions/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) { return new Response(200, TransmissionFunctionsApi::alterarStatus($request, $id), 'application/json'); }
]);

$obRouter->get('/api/v1/users', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, UsuariosApi::listar($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/users/simples', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, UsuariosApi::listarSimples($request), 'application/json');
    }
]);

$obRouter->get('/api/v1/users/{id}', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        return new Response(200, UsuariosApi::listarPorId($request, $id), 'application/json');
    }
]);

$obRouter->get('/api/v1/roles/simples', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, UsuariosApi::rolesSimples($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/users', [
    'middlewares' => ['Api'],
    function ($request) {
        return new Response(200, UsuariosApi::criar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/users/{id}/update', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        return new Response(200, UsuariosApi::atualizar($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/users/{id}/status', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        return new Response(200, UsuariosApi::alterarStatus($request, $id), 'application/json');
    }
]);

$obRouter->post('/api/v1/users/{id}/password', [
    'middlewares' => ['Api'],
    function ($request, $id) {
        return new Response(200, UsuariosApi::alterarSenha($request, $id), 'application/json');
    }
]);

$obRouter->get('/api/v1/settings', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, SettingsApi::carregar($request), 'application/json');
    }
]);

$obRouter->post('/api/v1/settings', [
    'middlewares' => ['Api'],
    function($request){
        return new Response(200, SettingsApi::salvar($request), 'application/json');
    }
]);
