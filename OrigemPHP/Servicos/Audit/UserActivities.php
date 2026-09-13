<?php

namespace OrigemPHP\Servicos\Audit;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class UserActivities extends BaseController
{
    public static function index($request)
    {
        Permissao::proteger('audit.view');
        session_start();
        return BaseController::renderInertia('System/UserActivities/index', ['user' => $_SESSION['users'] ?? []]);
    }
}
