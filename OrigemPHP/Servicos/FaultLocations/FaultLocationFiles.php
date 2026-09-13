<?php

namespace OrigemPHP\Servicos\FaultLocations;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class FaultLocationFiles extends BaseController
{
    public static function index($request)
    {
        session_start();
        Permissao::proteger('fault_locations.view');

        $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'FaultLocationFiles/index',
            [
                'user' => $users
            ]
        );
    }
}
