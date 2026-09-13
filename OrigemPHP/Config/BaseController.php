<?php



namespace OrigemPHP\Config;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use OrigemPHP\Config\Helpers;

use Jenssegers\Blade\Blade;

use OrigemPHP\Config\Connection;


class BaseController {
    private static $vars = [];
    private static $files = '';

     public static function init($vars = []) {
        self::$vars = $vars;
    }

    private static function content($view){
        $file = "../resources/views/{$view}.php";
        return file_exists($file) ? file_get_contents($file) : '';
    }

    protected static function renderView($viewPath, $layoutPath = null){   
        //print_r($viewPath);

        if (file_exists("../resources/views/{$viewPath}.blade.php")) {
            $blade = new Blade('../resources/views', '../storage/cache/');
            echo $blade->make($viewPath, $layoutPath)->render();
        } else {
            return require_once "../resources/views/404.php";
        }
        
    }

    protected static function renderHtml($view, $vars = []){
        $vars = array_merge(self::$vars, $vars);
        $keys = array_map(function($item){
            return '{{' . $item . '}}'; 
        },array_keys($vars));

        return str_replace($keys, array_values($vars),self::content($view));
    }


    protected static  function renderInertia($component, $props = []) {
        $page = [
            'component' => $component,
            'props' => $props,
            'url' => $_SERVER['REQUEST_URI']
        ];


        if (file_exists("../resources/views/app.blade.php")) {
            $blade = new Blade('../resources/views', '../storage/cache/');
            echo $blade->make('app', compact('page'))->render();
        } else {
            return require_once "../resources/views/404.php";
        }
    }
  
}