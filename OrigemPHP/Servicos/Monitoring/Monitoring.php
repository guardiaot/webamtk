<?php

namespace OrigemPHP\Servicos\Monitoring;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class Monitoring extends BaseController
{
    public static function index($request)
    {
        session_start();
        Permissao::proteger('monitoring.view');

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Maintenance/Monitoring/index',
            [
                'user' => $users
            ]
        );
    }
}
