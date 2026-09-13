<?php


namespace OrigemPHP\Config\Middleware;

use OrigemPHP\Config\Connection;
use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

use OrigemPHP\Config\BaseController;

class Maintenance  extends BaseController {

    public function handle($request, $next, $parms1){
       
        if(getenv('MANUTECAO') == 'true'){
            throw new \Exception("API em manuteção", 200);
        }
        return $next($request);
    }
}