<?php

namespace OrigemPHP\Servicos\Comtrade;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;

class ComtradeApi extends BaseController
{
    /**
     * ============================================================
     * LISTAR REGISTROS COMTRADE
     * ============================================================
     *
     * Parâmetros:
     * - page
     * - per_page
     * - ied_id
     * - status
     * - data_inicial
     * - data_final
     * - search
     */
    public static function listar($request)
    {
        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? 20);

        if ($pagina < 1) {
            $pagina = 1;
        }
        if ($perPage < 1) {
            $perPage = 20;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }

        $records = DB::table('comtrade_records')
            ->select(
                'comtrade_records.id',
                'comtrade_records.ied_id',
                'comtrade_records.agent_id',
                'comtrade_records.station_name',
                'comtrade_records.device_id',
                'comtrade_records.trigger_reason',
                'comtrade_records.nominal_frequency',
                'comtrade_records.sample_rate',
                'comtrade_records.total_samples',
                'comtrade_records.analog_channels',
                'comtrade_records.digital_channels',
                'comtrade_records.duration',
                'comtrade_records.timestamp',
                'comtrade_records.file_cfg',
                'comtrade_records.file_dat',
                'comtrade_records.status',
                'comtrade_records.created_at',
                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model'
            )
            ->leftJoin('ieds', 'comtrade_records.ied_id', '=', 'ieds.id');

        /*
         * FILTRO IED
         */
        if (
            isset($queryParams['ied_id']) &&
            trim($queryParams['ied_id']) !== ''
        ) {
            $records->where(
                'comtrade_records.ied_id',
                '=',
                trim($queryParams['ied_id'])
            );
        }

        /*
         * FILTRO STATUS
         */
        if (
            isset($queryParams['status']) &&
            trim($queryParams['status']) !== ''
        ) {
            $records->where(
                'comtrade_records.status',
                '=',
                trim($queryParams['status'])
            );
        }

        /*
         * DATA INICIAL
         */
        if (
            isset($queryParams['data_inicial']) &&
            trim($queryParams['data_inicial']) !== ''
        ) {
            $records->where(
                'comtrade_records.timestamp',
                '>=',
                trim($queryParams['data_inicial'])
            );
        }

        /*
         * DATA FINAL
         */
        if (
            isset($queryParams['data_final']) &&
            trim($queryParams['data_final']) !== ''
        ) {
            $records->where(
                'comtrade_records.timestamp',
                '<=',
                trim($queryParams['data_final']) . ' 23:59:59'
            );
        }

        /*
         * BUSCA GERAL
         */
        if (
            isset($queryParams['search']) &&
            trim($queryParams['search']) !== ''
        ) {
            $search = '%' . trim($queryParams['search']) . '%';
            $records->where(function ($q) use ($search) {
                $q->where('comtrade_records.station_name', 'like', $search)
                    ->orWhere('comtrade_records.device_id', 'like', $search)
                    ->orWhere('comtrade_records.trigger_reason', 'like', $search)
                    ->orWhere('ieds.name', 'like', $search);
            });
        }

        /*
         * ORDENAÇÃO
         */
        $records->orderByDesc('comtrade_records.timestamp');

        /*
         * PAGINAÇÃO
         */
        return collect(
            $records->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            )
        );
    }

    /**
     * ============================================================
     * DETALHE DE UM REGISTRO
     * ============================================================
     */
    public static function detalhe($request, $id)
    {
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

        if (!$record) {
            return [
                'erro' => 1,
                'mensagem' => 'Registro COMTRADE não encontrado.'
            ];
        }

        return $record;
    }

    /**
     * ============================================================
     * RESUMO
     * ============================================================
     */
    public static function resumo($request)
    {
        $total = DB::table('comtrade_records')->count();

        $available = DB::table('comtrade_records')
            ->where('status', 'available')
            ->count();

        $faults = DB::table('comtrade_records')
            ->where('trigger_reason', 'like', '%falta%')
            ->orWhere('trigger_reason', 'like', '%fault%')
            ->count();

        return [
            'total' => $total,
            'available' => $available,
            'faults' => $faults
        ];
    }
}
