<?php

namespace OrigemPHP\Servicos\FaultLocations;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class FaultLocationsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('fault_locations.view');

        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? 20)));
        $query = self::baseQuery();

        if (($params['status'] ?? '') !== '')
            $query->where('fault_locations.status', $params['status']);
        if (!empty($params['owner_id']))
            $query->where('owners.id', $params['owner_id']);
        if (!empty($params['regional_id']))
            $query->where('regionals.id', $params['regional_id']);
        if (!empty($params['installation_id']))
            $query->where('installations.id', $params['installation_id']);
        if (!empty($params['transmission_function_id']))
            $query->where('fault_locations.transmission_function_id', $params['transmission_function_id']);
        if (!empty($params['ied_id']))
            $query->where('comtrade_records.ied_id', $params['ied_id']);
        if (array_key_exists('is_high_risk', $params) && $params['is_high_risk'] !== '')
            $query->where('fault_locations.is_high_risk', self::booleanValue($params['is_high_risk']));
        if (($params['data_inicial'] ?? '') !== '')
            $query->where('fault_locations.calculated_at', '>=', trim($params['data_inicial']));
        if (($params['data_final'] ?? '') !== '')
            $query->where('fault_locations.calculated_at', '<=', trim($params['data_final']) . ' 23:59:59');

        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $search = '%' . $search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('ieds.code', 'ilike', $search)
                    ->orWhere('ieds.name', 'ilike', $search)
                    ->orWhere('ieds.manufacturer', 'ilike', $search)
                    ->orWhere('ieds.model', 'ilike', $search)
                    ->orWhere('comtrade_records.station_name', 'ilike', $search)
                    ->orWhere('comtrade_records.device_id', 'ilike', $search)
                    ->orWhere('transmission_functions.name', 'ilike', $search)
                    ->orWhere('installations.name', 'ilike', $search)
                    ->orWhere('regionals.name', 'ilike', $search)
                    ->orWhere('regionals.abbreviation', 'ilike', $search)
                    ->orWhere('owners.name', 'ilike', $search)
                    ->orWhere('states.name', 'ilike', $search)
                    ->orWhere('states.abbreviation', 'ilike', $search)
                    ->orWhere('fault_locations.fault_type', 'ilike', $search)
                    ->orWhere('fault_locations.algorithm', 'ilike', $search)
                    ->orWhere('fault_locations.status', 'ilike', $search);
            });
        }

        $total = (clone $query)->count('fault_locations.id');
        $pending = (clone $query)->where('fault_locations.status', 'pending')->count('fault_locations.id');
        $processing = (clone $query)->where('fault_locations.status', 'processing')->count('fault_locations.id');
        $calculated = (clone $query)->where('fault_locations.status', 'calculated')->count('fault_locations.id');
        $insufficientData = (clone $query)->where('fault_locations.status', 'insufficient_data')->count('fault_locations.id');
        $error = (clone $query)->where('fault_locations.status', 'error')->count('fault_locations.id');

        $sortFields = [
            'id' => 'fault_locations.id',
            'calculated_at' => 'fault_locations.calculated_at',
            'created_at' => 'fault_locations.created_at',
            'status' => 'fault_locations.status',
            'fault_distance_km' => 'fault_locations.fault_distance_km',
            'fault_distance_percent' => 'fault_locations.fault_distance_percent',
            'ied_name' => 'ieds.name',
            'transmission_function_name' => 'transmission_functions.name',
            'installation_name' => 'installations.name',
            'regional_name' => 'regionals.name',
            'owner_name' => 'owners.name',
        ];
        $sortKey = $params['sort'] ?? 'calculated_at';
        $sort = $sortFields[$sortKey] ?? $sortFields['calculated_at'];
        $direction = strtolower($params['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        if ($sortKey === 'calculated_at' && $direction === 'desc')
            $query->orderByRaw('fault_locations.calculated_at DESC NULLS FIRST');
        else
            $query->orderBy($sort, $direction);

        $pagination = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $pagination->items(),
            'current_page' => $pagination->currentPage(),
            'last_page' => $pagination->lastPage(),
            'per_page' => $pagination->perPage(),
            'total' => $total,
            'from' => $pagination->firstItem(),
            'to' => $pagination->lastItem(),
            'pending' => $pending,
            'processing' => $processing,
            'calculated' => $calculated,
            'insufficient_data' => $insufficientData,
            'error' => $error,
        ];
    }

    public static function detalhe($request, $id)
    {
        Permissao::proteger('fault_locations.view');

        $location = self::baseQuery()
            ->where('fault_locations.id', $id)
            ->first();

        if (!$location)
            return [
                'erro' => 1,
                'mensagem' => 'Localização da falta não encontrada.',
            ];

        $location->line_parameters = null;
        $location->risk_sections = collect();

        if ($location->transmission_function_id) {
            $location->line_parameters = DB::table('transmission_line_parameters')
                ->select('voltage_level', 'nominal_current', 'line_length_km', 'infeed', 'r1', 'r0', 'x1', 'x0')
                ->where('transmission_function_id', $location->transmission_function_id)
                ->first();

            $location->risk_sections = DB::table('transmission_line_risk_sections')
                ->select('id', 'km_start', 'km_end')
                ->where('transmission_function_id', $location->transmission_function_id)
                ->orderBy('km_start')
                ->orderBy('id')
                ->get();
        }

        return $location;
    }

    private static function baseQuery()
    {
        return DB::table('fault_locations')
            ->join('comtrade_records', 'fault_locations.comtrade_record_id', '=', 'comtrade_records.id')
            ->join('ieds', 'comtrade_records.ied_id', '=', 'ieds.id')
            ->leftJoin('transmission_functions', 'fault_locations.transmission_function_id', '=', 'transmission_functions.id')
            ->leftJoin('installations', 'transmission_functions.installation_id', '=', 'installations.id')
            ->leftJoin('regionals', 'installations.regional_id', '=', 'regionals.id')
            ->leftJoin('owners', 'regionals.owner_id', '=', 'owners.id')
            ->leftJoin('states', 'installations.state_id', '=', 'states.id')
            ->leftJoin('transmission_function_types', 'transmission_functions.type_id', '=', 'transmission_function_types.id')
            ->select(
                'fault_locations.id',
                'fault_locations.comtrade_record_id',
                'fault_locations.transmission_function_id',
                'fault_locations.fault_distance_km',
                'fault_locations.fault_distance_percent',
                'fault_locations.fault_type',
                'fault_locations.algorithm',
                'fault_locations.is_high_risk',
                'fault_locations.status',
                'fault_locations.error_message',
                'fault_locations.calculated_at',
                'fault_locations.created_at',
                'fault_locations.updated_at',
                'comtrade_records.ied_id',
                'comtrade_records.station_name',
                'comtrade_records.device_id',
                'comtrade_records.nominal_frequency',
                'comtrade_records.data_format',
                'comtrade_records.sample_count',
                'comtrade_records.cfg_filename',
                'comtrade_records.dat_filename',
                'comtrade_records.start_time',
                'comtrade_records.trigger_time',
                'comtrade_records.source as comtrade_source',
                'ieds.code as ied_code',
                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.model',
                'transmission_functions.name as transmission_function_name',
                'transmission_function_types.name as transmission_function_type_name',
                'installations.id as installation_id',
                'installations.name as installation_name',
                'regionals.id as regional_id',
                'regionals.name as regional_name',
                'regionals.abbreviation as regional_abbreviation',
                'owners.id as owner_id',
                'owners.name as owner_name',
                'states.id as state_id',
                'states.name as state_name',
                'states.abbreviation as state_abbreviation'
            );
    }

    private static function booleanValue($value): bool
    {
        return is_bool($value)
            ? $value
            : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1));
    }
}

