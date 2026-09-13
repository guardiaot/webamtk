<?php

namespace OrigemPHP\Servicos\Oscillography;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;


class OscillographyApi extends BaseController
{
    private static function statusSql()
    {
        return "CASE
            WHEN EXISTS (
                SELECT 1
                FROM comtrade_files cfg_file
                WHERE cfg_file.comtrade_record_id = comtrade_records.id
                  AND cfg_file.file_type = 'cfg'
            )
            AND EXISTS (
                SELECT 1
                FROM comtrade_files dat_file
                WHERE dat_file.comtrade_record_id = comtrade_records.id
                  AND dat_file.file_type = 'dat'
            )
            THEN 'available'
            ELSE 'incomplete'
        END";
    }

    private static function aplicarFiltros($query, $queryParams)
    {
        $statusSql = self::statusSql();

        if (
            isset($queryParams['ied_id']) &&
            trim($queryParams['ied_id']) !== ''
        ) {
            $query->where(
                'comtrade_records.ied_id',
                '=',
                trim($queryParams['ied_id'])
            );
        }

        if (
            isset($queryParams['status']) &&
            trim($queryParams['status']) !== ''
        ) {
            $status = trim($queryParams['status']);

            if (in_array($status, ['available', 'incomplete'], true)) {
                $query->whereRaw(
                    "($statusSql) = ?",
                    [$status]
                );
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if (
            isset($queryParams['data_inicial']) &&
            trim($queryParams['data_inicial']) !== ''
        ) {
            $dataInicial = trim($queryParams['data_inicial']);

            $query->whereRaw(
                'COALESCE(
                comtrade_records.start_time,
                comtrade_records.created_at
            ) >= ?',
                [$dataInicial]
            );
        }

        if (
            isset($queryParams['data_final']) &&
            trim($queryParams['data_final']) !== ''
        ) {
            $dataFinal = trim($queryParams['data_final']);

            $query->whereRaw(
                'COALESCE(
                comtrade_records.start_time,
                comtrade_records.created_at
            ) <= ?',
                [$dataFinal . ' 23:59:59']
            );
        }

        return $query;
    }

    /**
     * ============================================================
     * LISTAR REGISTROS DE OSCILOGRAFIA
     * ============================================================
     *
     * Utiliza a tabela comtrade_records como fonte de dados
     * oscilográficos (COMTRADE = formato padrão de oscilografia).
     */

    public static function listar($request)
    {
        Permissao::proteger('oscillography.view');
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

        /*
         * ============================================================
         * Quantidade de canais analógicos por registro
         * ============================================================
         */
        $analogChannels = DB::table('comtrade_analog_channels')
            ->select(
                'comtrade_record_id',
                DB::raw('COUNT(*) as analog_channels')
            )
            ->groupBy('comtrade_record_id');

        /*
         * ============================================================
         * Quantidade de canais digitais por registro
         * ============================================================
         */
        $digitalChannels = DB::table('comtrade_digital_channels')
            ->select(
                'comtrade_record_id',
                DB::raw('COUNT(*) as digital_channels')
            )
            ->groupBy('comtrade_record_id');

        /*
         * ============================================================
         * Taxa de amostragem por registro
         * ============================================================
         */
        $sampleRates = DB::table('comtrade_sample_rates')
            ->select(
                'comtrade_record_id',
                DB::raw('MIN(rate) as sample_rate')
            )
            ->groupBy('comtrade_record_id');

        /*
         * ============================================================
         * REGISTROS COMTRADE
         * ============================================================
         */
        $records = DB::table('comtrade_records')
            ->select(
                'comtrade_records.id',
                'comtrade_records.ied_id',
                'comtrade_records.station_name',
                'comtrade_records.device_id',
                'comtrade_records.nominal_frequency',
                'comtrade_records.sample_count',
                'comtrade_records.start_time',
                'comtrade_records.trigger_time',
                'comtrade_records.time_multiplier',
                'comtrade_records.cfg_filename',
                'comtrade_records.dat_filename',
                'comtrade_records.created_at',

                /*
                 * Dados do IED
                 */
                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',

                /*
                 * Quantidade de canais
                 */
                DB::raw(
                    'COALESCE(analog_channels.analog_channels, 0) as analog_channels'
                ),

                DB::raw(
                    'COALESCE(digital_channels.digital_channels, 0) as digital_channels'
                ),

                /*
                 * Taxa de amostragem
                 */
                DB::raw(
                    'sample_rates.sample_rate as sample_rate'
                ),

                /*
                 * Duração aproximada da oscilografia
                 *
                 * Fórmula:
                 *
                 * (quantidade de intervalos entre amostras)
                 * /
                 * taxa de amostragem
                 *
                 * Exemplo:
                 *
                 * (10 - 1) / 600 = 0.015 segundos
                 */
                DB::raw("
                CASE
                    WHEN sample_rates.sample_rate IS NOT NULL
                         AND comtrade_records.sample_count > 1
                    THEN
                        (comtrade_records.sample_count - 1)::numeric
                        / sample_rates.sample_rate
                    ELSE 0
                END as duration
            "),

                /*
                 * Status conforme a existência dos arquivos CFG e DAT.
                 */
                DB::raw(self::statusSql() . " as status")
            )

            /*
             * ========================================================
             * IED
             * ========================================================
             */
            ->leftJoin(
                'ieds',
                'comtrade_records.ied_id',
                '=',
                'ieds.id'
            )

            /*
             * ========================================================
             * CANAIS ANALÓGICOS
             * ========================================================
             */
            ->leftJoinSub(
                $analogChannels,
                'analog_channels',
                function ($join) {
                    $join->on(
                        'comtrade_records.id',
                        '=',
                        'analog_channels.comtrade_record_id'
                    );
                }
            )

            /*
             * ========================================================
             * CANAIS DIGITAIS
             * ========================================================
             */
            ->leftJoinSub(
                $digitalChannels,
                'digital_channels',
                function ($join) {
                    $join->on(
                        'comtrade_records.id',
                        '=',
                        'digital_channels.comtrade_record_id'
                    );
                }
            )

            /*
             * ========================================================
             * TAXA DE AMOSTRAGEM
             * ========================================================
             */
            ->leftJoinSub(
                $sampleRates,
                'sample_rates',
                function ($join) {
                    $join->on(
                        'comtrade_records.id',
                        '=',
                        'sample_rates.comtrade_record_id'
                    );
                }
            );

        /*
         * ============================================================
         * FILTRO IED
         * ============================================================
         */
        $records = self::aplicarFiltros($records, $queryParams);

        /*
         * ============================================================
         * FILTRO STATUS
         * ============================================================
         *
         * Filtros aplicados por aplicarFiltros().
         */

        /*
         * ============================================================
         * DATA INICIAL
         * ============================================================
         *
         * Filtro aplicado por aplicarFiltros().
         */

        /*
         * ============================================================
         * DATA FINAL
         * ============================================================
         *
         * Filtro aplicado por aplicarFiltros().
         */

        /*
         * ============================================================
         * BUSCA GERAL
         * ============================================================
         */
        if (
            isset($queryParams['search']) &&
            trim($queryParams['search']) !== ''
        ) {
            $search = '%' . trim($queryParams['search']) . '%';

            $records->where(function ($q) use ($search) {

                $q->where(
                    'comtrade_records.station_name',
                    'like',
                    $search
                )
                    ->orWhere(
                        'comtrade_records.device_id',
                        'like',
                        $search
                    )
                    ->orWhere(
                        'ieds.name',
                        'like',
                        $search
                    )
                    ->orWhere(
                        'ieds.manufacturer',
                        'like',
                        $search
                    )
                    ->orWhere(
                        'ieds.model',
                        'like',
                        $search
                    )
                    ->orWhere(
                        'comtrade_records.cfg_filename',
                        'like',
                        $search
                    )
                    ->orWhere(
                        'comtrade_records.dat_filename',
                        'like',
                        $search
                    );
            });
        }

        /*
         * ============================================================
         * ORDENAÇÃO
         * ============================================================
         *
         * Mais recentes primeiro.
         *
         * Se start_time existir:
         *     usa start_time
         *
         * Caso contrário:
         *     usa created_at
         *
         * Em caso de empate:
         *     usa o ID.
         */
        $records
            ->orderByRaw(
                'COALESCE(
                comtrade_records.start_time,
                comtrade_records.created_at
            ) DESC'
            )
            ->orderByDesc('comtrade_records.id');

        /*
         * ============================================================
         * PAGINAÇÃO
         * ============================================================
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
     * RESUMO
     * ============================================================
     */
    /**
     * ============================================================
     * RESUMO
     * ============================================================
     */
    public static function resumo($request)
    {
        Permissao::proteger('oscillography.view');
        $queryParams = $request->getQueryParams();
        $filteredRecords = self::aplicarFiltros(
            DB::table('comtrade_records'),
            $queryParams
        );

        $total = (clone $filteredRecords)->count();

        $ieds = (clone $filteredRecords)
            ->distinct()
            ->count('ied_id');

        $analogChannels = DB::table('comtrade_analog_channels')
            ->whereIn(
                'comtrade_record_id',
                (clone $filteredRecords)->select('id')
            )
            ->count();

        $digitalChannels = DB::table('comtrade_digital_channels')
            ->whereIn(
                'comtrade_record_id',
                (clone $filteredRecords)->select('id')
            )
            ->count();

        return [
            'total' => $total,
            'ieds' => $ieds,
            'analog_channels' => $analogChannels,
            'digital_channels' => $digitalChannels
        ];
    }

    public static function visualizar($request, $id)
    {
        Permissao::proteger('oscillography.view');

    
   

        $record = DB::table('comtrade_records')
            ->leftJoin('ieds', 'ieds.id', '=', 'comtrade_records.ied_id')
            ->leftJoinSub(
                DB::table('comtrade_analog_channels')
                    ->select(
                        'comtrade_record_id',
                        DB::raw('COUNT(*) as analog_channels')
                    )
                    ->groupBy('comtrade_record_id'),
                'analog_channels',
                'analog_channels.comtrade_record_id',
                '=',
                'comtrade_records.id'
            )
            ->leftJoinSub(
                DB::table('comtrade_digital_channels')
                    ->select(
                        'comtrade_record_id',
                        DB::raw('COUNT(*) as digital_channels')
                    )
                    ->groupBy('comtrade_record_id'),
                'digital_channels',
                'digital_channels.comtrade_record_id',
                '=',
                'comtrade_records.id'
            )
            ->leftJoinSub(
                DB::table('comtrade_sample_rates')
                    ->select(
                        'comtrade_record_id',
                        DB::raw('MIN(rate) as sample_rate')
                    )
                    ->groupBy('comtrade_record_id'),
                'sample_rates',
                'sample_rates.comtrade_record_id',
                '=',
                'comtrade_records.id'
            )
            ->where('comtrade_records.id', $id)
            ->select([
                'comtrade_records.id',
                'comtrade_records.ied_id',
                'comtrade_records.station_name',
                'comtrade_records.device_id',
                'comtrade_records.nominal_frequency',
                'comtrade_records.sample_count',
                'comtrade_records.start_time',
                'comtrade_records.trigger_time',
                'comtrade_records.time_multiplier',
                'comtrade_records.cfg_filename',
                'comtrade_records.dat_filename',
                'comtrade_records.created_at',

                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',

                'analog_channels.analog_channels',
                'digital_channels.digital_channels',

                'sample_rates.sample_rate',

                DB::raw("
                CASE
                    WHEN sample_rates.sample_rate IS NOT NULL
                         AND comtrade_records.sample_count > 1
                    THEN
                        (comtrade_records.sample_count - 1)::numeric
                        / sample_rates.sample_rate
                    ELSE 0
                END as duration
            "),

                DB::raw(self::statusSql() . " as status"),
            ])
            ->first();

        if (!$record) {
            throw new \Exception('Registro COMTRADE não encontrado.', 404);
        }

        return  $record;
       
    }

    public static function samples($request, $id)
    {
        Permissao::proteger('oscillography.view');
        // Verifica se o registro COMTRADE existe
        $record = DB::table('comtrade_records')
            ->where('id', $id)
            ->first();

        if (!$record) {
            throw new \Exception('Registro COMTRADE não encontrado.', 404);
        }

        // Busca os canais analógicos
        $analogChannels = DB::table('comtrade_analog_channels')
            ->where('comtrade_record_id', $id)
            ->orderBy('channel_number')
            ->get([
                'channel_number',
                'name',
                'phase',
                'circuit',
                'unit',
                'primary_value',
                'secondary_value',
                'ps'
            ]);

        // Busca os canais digitais
        $digitalChannels = DB::table('comtrade_digital_channels')
            ->where('comtrade_record_id', $id)
            ->orderBy('channel_number')
            ->get([
                'channel_number',
                'name',
                'phase',
                'circuit',
                'normal_state'
            ]);

        // Busca as amostras
        $samples = DB::table('comtrade_samples')
            ->where('comtrade_record_id', $id)
            ->orderBy('sample_number')
            ->get([
                'sample_number',
                'timestamp',
                'analog_values',
                'digital_values'
            ]);

        return  [
                'record_id' => (int) $id,
                'sample_count' => $samples->count(),
                'channels' => [
                    'analog' => $analogChannels,
                    'digital' => $digitalChannels,
                ],
                'samples' => $samples
            ];
        
    }


}
