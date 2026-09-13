<?php

namespace OrigemPHP\Servicos\States;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class StatesApi extends BaseController
{
    public static function listarSimples($request)
    {
        Permissao::proteger('installations.view');
        
        return DB::table('states')
            ->select('id', 'abbreviation', 'name')
            ->selectRaw("abbreviation || ' - ' || name as label")
            ->where('enabled', true)
            ->orderBy('name')
            ->get();
    }
}
