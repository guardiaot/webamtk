<?php

namespace OrigemPHP\Servicos\FaultLocations;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class FaultLocations extends BaseController
{
    public static function index($request)
    {
        Permissao::proteger('fault_locations.view');
        session_start();

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'FaultLocations/index',
            [
                'user' => $users
            ]
        );
    }

    public static function detalhe($request, $id)
    {
        Permissao::proteger('fault_locations.view');
        session_start();

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'FaultLocations/Show/index',
            [
                'user' => $users,
                'id' => $id
            ]
        );
    }
}
