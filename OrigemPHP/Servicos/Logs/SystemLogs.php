<?php

namespace OrigemPHP\Servicos\Logs;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class SystemLogs extends BaseController
{
    public static function index($request)
    {
        Permissao::proteger('audit.view');
        session_start();
        return BaseController::renderInertia('System/SystemLogs/index', ['user' => $_SESSION['users'] ?? []]);
    }
}
