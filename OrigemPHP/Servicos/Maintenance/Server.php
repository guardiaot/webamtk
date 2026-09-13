<?php

namespace OrigemPHP\Servicos\Maintenance;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class Server extends BaseController
{
    public static function index($request)
    {
        session_start();
        Permissao::proteger('server.view');

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Maintenance/Server/index',
            [
                'user' => $users
            ]
        );
    }
}
