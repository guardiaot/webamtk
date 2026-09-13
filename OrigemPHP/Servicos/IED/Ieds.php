<?php

namespace OrigemPHP\Servicos\IED;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;
use OrigemPHP\Models\PerguntaSite;
use OrigemPHP\Models\RecursoSite;

use OrigemPHP\Models\IED;
use OrigemPHP\Servicos\IED\IedsApi;

class Ieds extends BaseController
{

    public static function ieds($request)
    {
        session_start();
        $users = $_SESSION['users'] ?? [];

        $iedResumo = DB::table('ieds')
            ->selectRaw("
            COUNT(*) as total,
                SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online,
                SUM(CASE WHEN source = 'discovery' THEN 1 ELSE 0 END) as discovery,
                SUM(CASE WHEN source = 'manual' THEN 1 ELSE 0 END) as manual
        ")
            ->first();


        $iedResumo = [
            'total' => $iedResumo->total,
            'status' => $iedResumo->online,
            'discovery' => $iedResumo->discovery,
            'manual' => $iedResumo->manual
        ];




        return BaseController::renderInertia(
            'IED/index',
            [
                'user' => $users,
                'iedResumo' => $iedResumo
            ]
        );
    }

    public static function listaIeds($request)
    {
        session_start();

        $users = $_SESSION['users'] ?? [];


        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);

        $perPage = (int) ($queryParams['per_page'] ?? 10);

        if ($pagina < 1) {
            $pagina = 1;
        }

        if ($perPage < 1) {
            $perPage = 10;
        }

        if ($perPage > 100) {
            $perPage = 100;
        }


        $ieds = DB::table('ieds')
            ->select(
                'ieds.id',
                'ieds.agent_id',
                'ieds.name',
                'ieds.manufacturer',
                'ieds.model',
                'ieds.host',
                'ieds.port',
                'ieds.status',
                'ieds.source',
                'ieds.response_time_us',
                'ieds.last_check',
                'ieds.last_seen',
                'ieds.failures',
                'ieds.checks',
                'ieds.consecutive_failures',
                'ieds.created_at',
                'ieds.updated_at',
                'agents.name as agent_name',
                'agents.version as agent_version'
            )
            ->leftJoin(
                'agents',
                'ieds.agent_id',
                '=',
                'agents.id'
            );


        /*
         * ============================================================
         * BUSCA GERAL
         * ============================================================
         */

        if (
            isset($queryParams['search']) &&
            trim($queryParams['search']) !== ''
        ) {

            $search = trim($queryParams['search']);
            $valor = '%' . $search . '%';

            $ieds->where(function ($q) use ($valor) {

                $q->where('ieds.id', 'like', $valor)
                    ->orWhere('ieds.name', 'like', $valor)
                    ->orWhere('ieds.manufacturer', 'like', $valor)
                    ->orWhere('ieds.model', 'like', $valor)
                    ->orWhere('ieds.host', 'like', $valor)
                    ->orWhere('agents.name', 'like', $valor);

            });
        }


        /*
         * ============================================================
         * FILTRO POR NOME
         * ============================================================
         */

        if (
            isset($queryParams['nome']) &&
            trim($queryParams['nome']) !== ''
        ) {

            $ieds->where(
                'ieds.name',
                'like',
                '%' . trim($queryParams['nome']) . '%'
            );
        }


        /*
         * ============================================================
         * FABRICANTE
         * ============================================================
         */

        if (
            isset($queryParams['manufacturer']) &&
            trim($queryParams['manufacturer']) !== ''
        ) {

            $ieds->where(
                'ieds.manufacturer',
                '=',
                trim($queryParams['manufacturer'])
            );
        }


        /*
         * ============================================================
         * MODELO
         * ============================================================
         */

        if (
            isset($queryParams['model']) &&
            trim($queryParams['model']) !== ''
        ) {

            $ieds->where(
                'ieds.model',
                '=',
                trim($queryParams['model'])
            );
        }


        /*
         * ============================================================
         * STATUS
         * ============================================================
         */

        if (
            isset($queryParams['status']) &&
            trim($queryParams['status']) !== ''
        ) {

            $ieds->where(
                'ieds.status',
                '=',
                trim($queryParams['status'])
            );
        }


        /*
         * ============================================================
         * AGENT
         * ============================================================
         */

        if (
            isset($queryParams['agent_id']) &&
            trim($queryParams['agent_id']) !== ''
        ) {

            $ieds->where(
                'ieds.agent_id',
                '=',
                trim($queryParams['agent_id'])
            );
        }


        /*
         * ============================================================
         * HOST
         * ============================================================
         */

        if (
            isset($queryParams['host']) &&
            trim($queryParams['host']) !== ''
        ) {

            $ieds->where(
                'ieds.host',
                'like',
                '%' . trim($queryParams['host']) . '%'
            );
        }


        /*
         * ============================================================
         * ORDENAÇÃO
         * ============================================================
         */

        $ieds->orderBy(
            'ieds.name',
            'asc'
        );


        /*
         * ============================================================
         * PAGINAÇÃO
         * ============================================================
         */

        $result = collect(
            $ieds->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            )
        );

        return $result;
    }


    public static function sava($request)
    {

        $dados = $request->getPostVars();
        if (!$dados['agent_id']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe o agente .'
            ];
        }
        if (!$dados['name']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe o nome.'
            ];
        }
        if (!$dados['manufacturer']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe o fabricante.'
            ];
        }
        if (!$dados['model']) {
            return [
                'erro' => 1,
                'mensagem' => 'IED não encontrado.'
            ];
        }
        if (!$dados['model']) {
            return [
                'erro' => 1,
                'mensagem' => 'IED não encontrado.'
            ];
        }
        if (!$dados['host']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe o endereço IP ou host.'
            ];
        }
        if (!$dados['source']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe o source.'
            ];
        }
        if (!$dados['port']) {
            return [
                'erro' => 1,
                'mensagem' => 'Informe a porta de conexão.'
            ];
        }

        $ied = IED::cadastrar([
            'agent_id' => $dados['agent_id'],
            'name' => $dados['name'],
            'manufacturer' => $dados['manufacturer'],
            'model' => $dados['model'],
            'host' => $dados['host'],
            'source' => strtolower($dados['source']),
            'port' => $dados['port'] ?? 102,
        ]);


        return [
            'erro' => 0,
            'mensagem' => 'IED atualizado com sucesso.',
            'data' => $ied
        ];

    }

    /**
     * ============================================================
     * ATUALIZAR IED
     * ============================================================
     */
    public static function atualizar($request, $id)
    {
        $dados = $request->getPostVars();

        $ied = IED::where('id', $id)->first();

        if (!$ied) {
            return [
                'erro' => 1,
                'mensagem' => 'IED não encontrado.'
            ];
        }

        $ied->update([
            'agent_id' => $dados['agent_id'] ?? $ied->agent_id,
            'name' => $dados['name'] ?? $ied->name,
            'manufacturer' => $dados['manufacturer'] ?? $ied->manufacturer,
            'model' => $dados['model'] ?? $ied->model,
            'host' => $dados['host'] ?? $ied->host,
            'port' => $dados['port'] ?? $ied->port,
            'status' => $dados['status'] ?? $ied->status,
        ]);

        return [
            'erro' => 0,
            'mensagem' => 'IED atualizado com sucesso.',
            'data' => $ied
        ];
    }

    /**
     * ============================================================
     * EXCLUIR IED
     * ============================================================
     */
    public static function excluir($request, $id)
    {
        $ied = IED::where('id', $id)->first();

        if (!$ied) {
            return [
                'erro' => 1,
                'mensagem' => 'IED não encontrado.'
            ];
        }

        $ied->delete();

        return [
            'erro' => 0,
            'mensagem' => 'IED excluído com sucesso.'
        ];
    }

    public static function detalhe($request, $id)
    {
        session_start();

        $users = $_SESSION['users'] ?? [];


        $ied = IedsApi::visualizar($request, $id);

        if (is_object($ied)) {
            $agent = DB::table('agents')
                ->select('agents.name as agent_name', 'agents.version as agent_version')
                ->where('agents.id', $ied->agent_id)
                ->first();
            $ied->agent_name = $agent->agent_name ?? null;
            $ied->agent_version = $agent->agent_version ?? null;
        } else {
            $ied = null;
        }

        if (!$ied) {
            return BaseController::renderInertia(
                'IED/NotFound',
                [
                    'user' => $users,
                    'id' => $id
                ]
            );
        }

        return BaseController::renderInertia(
            'IED/Show/index',
            [
                'user' => $users,
                'ied' => $ied
            ]
        );
    }

}
