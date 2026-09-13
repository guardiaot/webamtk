<?php

#echo "<pre>";


set_time_limit(0);
require_once 'vendor/autoload.php';

use OrigemPHP\Config\Router;

define('URL', 'http://oferta.test');
$obRouter = new  Router(URL);

require_once('OrigemPHP/routes/main.php');
require_once('OrigemPHP/routes/Middleware.php');

$obRouter->run()
         ->sendResponse();