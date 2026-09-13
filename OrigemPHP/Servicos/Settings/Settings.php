<?php

namespace OrigemPHP\Servicos\Settings;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;
use OrigemPHP\Models\PerguntaSite;
use OrigemPHP\Models\RecursoSite;
use OrigemPHP\Servicos\Usuarios\Permissao;

class Settings extends BaseController
{

    public static function ieds($request)
    {
        Permissao::proteger('ieds.view');
        session_start();

         $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Settings/IEDs/Modern',
            [
                'user' => $users
            ]
        );
    }

     public static function agents($request)
    {
        Permissao::proteger('agents.view');
        session_start();

        $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Settings/Agents/index',
            [
                'user' => $users
            ]
        );
    }

    public static function owners($request)
    {
        Permissao::proteger('owners.view');
        session_start();

        $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Settings/Owners/index',
            ['user' => $users]
        );
    }

    public static function users($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('users.view');
        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Settings/Users/index',
            ['user' => $users]
        );
    }

    public static function regionals($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('regionals.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/Regionals/index', ['user' => $users]);
    }

    public static function installations($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('installations.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/Installations/index', ['user' => $users]);
    }

    public static function transmissionFunctionTypes($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('transmission_functions.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/TransmissionFunctionTypes/index', ['user' => $users]);
    }

    public static function iedTypes($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('ieds.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/IEDTypes/index', ['user' => $users]);
    }

    public static function iedTemplates($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('ieds.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/IEDTemplates/index', ['user' => $users]);
    }

    public static function collectionDrivers($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('ieds.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/CollectionDrivers/index', ['user' => $users]);
    }

    public static function messageTypes($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('message_types.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/MessageTypes/index', ['user' => $users]);
    }

    public static function transmissionFunctions($request)
    {
        session_start();
        \OrigemPHP\Servicos\Usuarios\Permissao::proteger('transmission_functions.view');
        $users = $_SESSION['users'] ?? [];
        return BaseController::renderInertia('Settings/TransmissionFunctions/index', ['user' => $users]);
    }

    public static function system($request)
    {
        Permissao::proteger('settings.view');
        session_start();

        $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Settings/System/index',
            [
                'user' => $users
            ]
        );
    }
}
