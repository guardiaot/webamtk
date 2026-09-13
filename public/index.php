<?php


error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

#echo "<pre>";
//print_r($_SERVER['DOCUMENT_ROOT'].'/../');
set_time_limit(0);
require_once '../vendor/autoload.php';

//print_r("produção");

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Facade;
use Illuminate\Container\Container;
use Illuminate\Support\ServiceProvider;

// Inicialize o container de serviços
$container = new Container();
Facade::setFacadeApplication($container);

// Registre a facade Http usando o container
$container->singleton('http', function () {
    return new \Illuminate\Http\Client\Factory();
});

use OrigemPHP\Config\Router;
use OrigemPHP\Config\ConnectionDb;
new ConnectionDb();

use OrigemPHP\Config\Connection;
new Connection();

define('URL', 'http://amtk.test');
$obRouter = new  Router(URL);

require_once('../OrigemPHP/Rotas/main.php');
require_once('../OrigemPHP/Rotas/Middleware.php');

$obRouter->run()
         ->sendResponse();
