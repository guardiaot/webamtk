<?php

namespace OrigemPHP\Servicos\Maintenance;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class Upload extends BaseController
{
    public static function index($request)
    {
        session_start();
        Permissao::proteger('comtrade.upload');

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Maintenance/Upload/index',
            [
                'user' => $users
            ]
        );
    }
}
