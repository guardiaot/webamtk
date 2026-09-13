<?php

namespace OrigemPHP\Servicos\Telemetry;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;
use OrigemPHP\Models\PerguntaSite;
use OrigemPHP\Models\RecursoSite;

class Telemetry extends BaseController
{


    public static function Telemetry($request)
    {
        Permissao::proteger('telemetry.view');
        session_start();

       $users = $_SESSION['users'] ?? [];



        return BaseController::renderInertia(
            'Telemetry/index',
            [
                'user' => $users
            ]
        );
    }

    

    public static function ieds($request)
    {
        Permissao::proteger('telemetry.view');
        return DB::table('ieds')
            ->select(
                'ieds.id',
                'ieds.name',
                'ieds.manufacturer',
                'ieds.model',
                'ieds.status'
            )
            ->orderBy('ieds.name', 'asc')
            ->get();
    }

    ### Métodos de consulta do `Telemetry.php`

    /**
     * ============================================================
     * LISTAR TELEMETRIA
     * ============================================================
     *
     * Filtros:
     * - ied_id
     * - agent_id
     * - data_inicial
     * - data_final
     * - page
     * - per_page
     */
    public static function listar($request)
    {
        Permissao::proteger('telemetry.view');
        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);

        $perPage = (int) ($queryParams['per_page'] ?? 20);

        if ($pagina < 1) {
            $pagina = 1;
        }

        if ($perPage < 1) {
            $perPage = 20;
        }

        if ($perPage > 500) {
            $perPage = 500;
        }


        $telemetry = DB::table('telemetry')

            ->select(
                'telemetry.id',
                'telemetry.agent_id',
                'telemetry.ied_id',

                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',

                'telemetry.timestamp',

                'telemetry.ia',
                'telemetry.ib',
                'telemetry.ic',

                'telemetry.va',
                'telemetry.vb',
                'telemetry.vc',

                'telemetry.frequency'
            )

            ->leftJoin(
                'ieds',
                'telemetry.ied_id',
                '=',
                'ieds.id'
            );


        /*
         * ========================================================
         * FILTRO IED
         * ========================================================
         */

        if (
            isset($queryParams['ied_id']) &&
            trim($queryParams['ied_id']) !== ''
        ) {

            $telemetry->where(
                'telemetry.ied_id',
                '=',
                trim($queryParams['ied_id'])
            );
        }


        /*
         * ========================================================
         * FILTRO AGENT
         * ========================================================
         */

        if (
            isset($queryParams['agent_id']) &&
            trim($queryParams['agent_id']) !== ''
        ) {

            $telemetry->where(
                'telemetry.agent_id',
                '=',
                trim($queryParams['agent_id'])
            );
        }


        /*
         * ========================================================
         * DATA INICIAL
         * ========================================================
         */

        if (
            isset($queryParams['data_inicial']) &&
            trim($queryParams['data_inicial']) !== ''
        ) {

            $telemetry->where(
                'telemetry.timestamp',
                '>=',
                trim($queryParams['data_inicial'])
            );
        }


        /*
         * ========================================================
         * DATA FINAL
         * ========================================================
         */

        if (
            isset($queryParams['data_final']) &&
            trim($queryParams['data_final']) !== ''
        ) {

            $telemetry->where(
                'telemetry.timestamp',
                '<=',
                trim($queryParams['data_final'])
            );
        }


        /*
         * ========================================================
         * ORDENAÇÃO
         * ========================================================
         */

        $telemetry->orderByDesc(
            'telemetry.timestamp'
        );


        /*
         * ========================================================
         * PAGINAÇÃO
         * ========================================================
         */

        return collect(
            $telemetry->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            )
        );
    }


    /**
     * ============================================================
     * ÚLTIMA TELEMETRIA DE UM IED
     * ============================================================
     */
    public static function ultimaPorIed($request, $iedId)
    {
        Permissao::proteger('telemetry.view');
        return DB::table('telemetry')
            ->select(
                'telemetry.id',
                'telemetry.agent_id',
                'telemetry.ied_id',

                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',

                'telemetry.timestamp',

                'telemetry.ia',
                'telemetry.ib',
                'telemetry.ic',

                'telemetry.va',
                'telemetry.vb',
                'telemetry.vc',

                'telemetry.frequency'
            )
            ->leftJoin(
                'ieds',
                'telemetry.ied_id',
                '=',
                'ieds.id'
            )
            ->where(
                'telemetry.ied_id',
                $iedId
            )
            ->orderByDesc(
                'telemetry.timestamp'
            )
            ->first();
    }


    /**
     * ============================================================
     * ÚLTIMA TELEMETRIA DE CADA IED
     * ============================================================
     */
    public static function ultimas($request)
    {
        Permissao::proteger('telemetry.view');
        return DB::table('telemetry as t')
            ->select(
                't.id',
                't.agent_id',
                't.ied_id',

                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',

                't.timestamp',

                't.ia',
                't.ib',
                't.ic',

                't.va',
                't.vb',
                't.vc',

                't.frequency'
            )
            ->leftJoin(
                'ieds',
                't.ied_id',
                '=',
                'ieds.id'
            )
            ->whereIn(
                't.id',
                function ($query) {

                    $query
                        ->selectRaw('MAX(id)')
                        ->from('telemetry')
                        ->groupBy('ied_id');

                }
            )
            ->orderBy(
                'ieds.name'
            )
            ->get();
    }


    

}
