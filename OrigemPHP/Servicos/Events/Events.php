<?php

namespace OrigemPHP\Servicos\Events;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;
use OrigemPHP\Models\PerguntaSite;
use OrigemPHP\Models\RecursoSite;

class Events extends BaseController
{

public static function eventos($request)
    {
        session_start();
        Permissao::proteger('events.view');

         $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Events/index',
            [
                'user' => $users
            ]
        );
    }
}
