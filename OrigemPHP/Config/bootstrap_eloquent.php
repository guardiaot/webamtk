<?php

namespace Config;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;



if (!file_exists($_SERVER['DOCUMENT_ROOT'].'/../.env')) {
  return false;
  // throw new \Exception("configuraçoes de banco", 404);
}

$envs = parse_ini_file($_SERVER['DOCUMENT_ROOT'].'/../.env');
foreach ($envs as $key => $value) {
  $_ENV[$key] = $value;
}

//C:\laragon\www\ksi-seguros-template\.env



$capsule = new Capsule;
if (getenv('DB_CONNECTION') == 'mysql') {
  $capsule->addConnection([
    'driver' => preg_replace('/\s\s+/', '', trim($_ENV['DB_CONNECTION'])),
    'host' => preg_replace('/\s\s+/', '', trim($_ENV['DB_HOST'])),
    'database' => preg_replace('/\s\s+/', '', trim($_ENV['DB_DATABASE'])),
    'username' => preg_replace('/\s\s+/', '', trim($_ENV['DB_USERNAME'])),
    'password' => preg_replace('/\s\s+/', '', trim($_ENV['DB_PASSWORD'])),
    'port' => preg_replace('/\s\s+/', '', trim($_ENV['DB_PORT'])),
    'prefix' => '',
    'strict' => false,
    'modes' => [
      'STRICT_TRANS_TABLES',
      'NO_ZERO_IN_DATE',
      'NO_ZERO_DATE',
      'ERROR_FOR_DIVISION_BY_ZERO',
      'NO_AUTO_CREATE_USER',
      'NO_ENGINE_SUBSTITUTION',
    ],
    'engine' => null,
  ]);
  //    $capsule->getConnection()->statement("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
} elseif (getenv('DB_CONNECTION') == 'sqlite') {
  $capsule->addConnection([
    'driver' => 'sqlite',
    'database' => __DIR__ . "/../storage/database/" . $conf['sqlite']['database']
  ]);
}

$capsule->setEventDispatcher(new Dispatcher(new Container));

$capsule->setAsGlobal();
$capsule->bootEloquent();