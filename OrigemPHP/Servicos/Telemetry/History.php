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

class History extends BaseController
{
    public static function historico($request)
    {
        Permissao::proteger('telemetry.view');
        session_start();

         $users = $_SESSION['users'] ?? [];


        return BaseController::renderInertia(
            'Telemetry/History/index',
            [
                'user' => $users
            ]
        );
    }

    /**
     * ============================================================
     * HISTÓRICO DE TELEMETRIA DE UM IED
     * ============================================================
     */
    public static function historicoIed($request, $iedId = null)
    {
        Permissao::proteger('telemetry.view');
        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? 100);

        if ($pagina < 1) {
            $pagina = 1;
        }

        if ($perPage < 1) {
            $perPage = 100;
        }

        if ($perPage > 1000) {
            $perPage = 1000;
        }

        $telemetry = DB::table('telemetry')
            ->leftJoin('ieds', 'telemetry.ied_id', '=', 'ieds.id')
            ->select(
                'telemetry.id',
                'telemetry.agent_id',
                'telemetry.ied_id',
                'telemetry.timestamp',
                'telemetry.ia',
                'telemetry.ib',
                'telemetry.ic',
                'telemetry.va',
                'telemetry.vb',
                'telemetry.vc',
                'telemetry.frequency',
                'ieds.name as name',
                'ieds.code as code',
                'ieds.manufacturer as manufacturer',
                'ieds.model as model'
            );

        /*
         * ========================================================
         * IED
         * ========================================================
         *
         * Se foi informado um IED específico, filtra.
         *
         * null
         * ""
         * "all"
         *
         * significam todos os IEDs.
         */
        if (
            $iedId !== null &&
            trim((string) $iedId) !== '' &&
            strtolower(trim((string) $iedId)) !== 'all'
        ) {
            $telemetry->where(
                'ied_id',
                $iedId
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
                'timestamp',
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
                'timestamp',
                '<',
                Carbon::parse(trim($queryParams['data_final']))
                    ->addDay()
                    ->startOfDay()
                    ->toDateTimeString()
            );
        }

        return $telemetry
            ->orderByDesc('timestamp')
            ->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            );
    }

    public static function historicoData($request)
    {
        Permissao::proteger('telemetry.view');
        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? 100);

        if ($pagina < 1) {
            $pagina = 1;
        }

        if ($perPage < 1) {
            $perPage = 100;
        }

        if ($perPage > 1000) {
            $perPage = 1000;
        }

        $telemetry = DB::table('telemetry')
            ->leftJoin('ieds', 'telemetry.ied_id', '=', 'ieds.id')
            ->select(
                'telemetry.id',
                'telemetry.agent_id',
                'telemetry.ied_id',
                'telemetry.timestamp',
                'telemetry.ia',
                'telemetry.ib',
                'telemetry.ic',
                'telemetry.va',
                'telemetry.vb',
                'telemetry.vc',
                'telemetry.frequency',
                'ieds.name as name',
                'ieds.code as code',
                'ieds.manufacturer as manufacturer',
                'ieds.model as model'
            );

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
                'timestamp',
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
                'timestamp',
                '<',
                Carbon::parse(trim($queryParams['data_final']))
                    ->addDay()
                    ->startOfDay()
                    ->toDateTimeString()
            );
        }

        return 
            $telemetry
                ->orderByDesc('timestamp')
                ->paginate(
                    $perPage,
                    ['*'],
                    'page',
                    $pagina
                );
    }
}
