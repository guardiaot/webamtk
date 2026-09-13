<?php



namespace OrigemPHP\Config;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Support\Facades\DB;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

class Connection {
   

    function __construct() {
      
        if(!file_exists($_SERVER['DOCUMENT_ROOT'].'/../.env')) {
          return false;
          // throw new \Exception("configuraçoes de banco", 404);
        }
  
        $envs = parse_ini_file($_SERVER['DOCUMENT_ROOT'].'/../.env');
        foreach ($envs as $key => $value) {
            $_ENV[$key] = $value;
        }


        $capsule = new Capsule;
        $capsule->addConnection([
            'driver' =>  preg_replace('/\s\s+/', '', trim($_ENV['DB_CONNECTION'])),
            'host' =>  preg_replace('/\s\s+/', '', trim($_ENV['DB_HOST'])),
            'database' =>  preg_replace('/\s\s+/', '', trim($_ENV['DB_DATABASE'])),
            'strict' => false,
            'username' =>  preg_replace('/\s\s+/', '', trim($_ENV['DB_USERNAME'])),
            'password' =>  preg_replace('/\s\s+/', '', trim($_ENV['DB_PASSWORD'])),
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => '',


        ]);


        $capsule->bootEloquent();
        $capsule->setAsGlobal();
    }


}