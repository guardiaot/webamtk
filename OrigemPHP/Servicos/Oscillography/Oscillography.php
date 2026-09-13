<?php

namespace OrigemPHP\Servicos\Oscillography;



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

class Oscillography extends BaseController
{

    public static function index($request)
    {
        Permissao::proteger('oscillography.view');
        session_start();

         $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Oscillography/index',
            [
                'user' => $users
            ]
        );
    }

    public static function comtradeId($request, $id)
    {
        Permissao::proteger('oscillography.view');
        session_start();

         $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Oscillography/Show/index',
            [
                'user' => $users,
                'id' => $id
            ]
        );
    }
}
