<?php

namespace OrigemPHP\Servicos\Maintenance;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class Triggers extends BaseController
{
    public static function index($request)
    {
        session_start();
        Permissao::proteger('oscillography.view');

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Maintenance/Triggers/index',
            [
                'user' => $users
            ]
        );
    }
}
