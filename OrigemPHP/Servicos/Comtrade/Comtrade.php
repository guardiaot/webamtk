<?php

namespace OrigemPHP\Servicos\Comtrade;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;

class Comtrade extends BaseController
{
    /**
     * ============================================================
     * RENDERIZAR PÁGINA LISTA
     * ============================================================
     */
    public static function index($request)
    {
        session_start();

         $users = $_SESSION['users'] ?? [];

        return BaseController::renderInertia(
            'Comtrade/index',
            [
                'users' => $users
            ]
        );
    }

    /**
     * ============================================================
     * RENDERIZAR PÁGINA DETALHE
     * ============================================================
     */
    public static function detalhe($request, $id)
    {
        session_start();

         $users = $_SESSION['users'] ?? [];

        $record = DB::table('comtrade_records')
            ->select(
                'comtrade_records.*',
                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',
                'agents.name as agent_name'
            )
            ->leftJoin('ieds', 'comtrade_records.ied_id', '=', 'ieds.id')
            ->leftJoin('agents', 'comtrade_records.agent_id', '=', 'agents.id')
            ->where('comtrade_records.id', $id)
            ->first();

        return BaseController::renderInertia(
            'Comtrade/Show/index',
            [
                'users' => $users,
                'record' => $record
            ]
        );
    }
}
