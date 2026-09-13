<?php

namespace OrigemPHP\Servicos\FaultLocations;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class FaultLocationFilesApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('fault_locations.view');

        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));

        $query = DB::table('fault_locations')
            ->join('comtrade_records', 'fault_locations.comtrade_record_id', '=', 'comtrade_records.id')
            ->join('ieds', 'comtrade_records.ied_id', '=', 'ieds.id')
            ->leftJoin('transmission_functions', 'fault_locations.transmission_function_id', '=', 'transmission_functions.id')
            ->leftJoin('installations', 'transmission_functions.installation_id', '=', 'installations.id')
            ->leftJoin('comtrade_files as cfg_file', function ($join) {
                $join->on('cfg_file.comtrade_record_id', '=', 'comtrade_records.id')
                    ->where('cfg_file.file_type', 'cfg');
            })
            ->leftJoin('comtrade_files as dat_file', function ($join) {
                $join->on('dat_file.comtrade_record_id', '=', 'comtrade_records.id')
                    ->where('dat_file.file_type', 'dat');
            })
            ->select(
                'fault_locations.id as fault_location_id',
                'fault_locations.fault_distance_km',
                'fault_locations.status',
                'fault_locations.calculated_at',
                'comtrade_records.id as comtrade_record_id',
                'comtrade_records.ied_id',
                'comtrade_records.source',
                'ieds.code as ied_code',
                'ieds.name as ied_name',
                'installations.id as installation_id',
                'installations.name as installation_name',
                'cfg_file.filename as cfg_filename',
                'dat_file.filename as dat_filename'
            );

        if (!empty($params['ied_id'])) {
            $query->where('comtrade_records.ied_id', $params['ied_id']);
        }

        if (!empty($params['installation_id'])) {
            $query->where('installations.id', $params['installation_id']);
        }

        if (($params['source'] ?? '') !== '') {
            $query->where('comtrade_records.source', trim($params['source']));
        }

        if (($params['data_inicial'] ?? '') !== '') {
            $query->where('fault_locations.calculated_at', '>=', trim($params['data_inicial']));
        }

        if (($params['data_final'] ?? '') !== '') {
            $query->where('fault_locations.calculated_at', '<=', trim($params['data_final']) . ' 23:59:59');
        }

        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $search = '%' . $search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('ieds.code', 'ilike', $search)
                    ->orWhere('ieds.name', 'ilike', $search)
                    ->orWhere('installations.name', 'ilike', $search)
                    ->orWhere('comtrade_records.source', 'ilike', $search)
                    ->orWhere('cfg_file.filename', 'ilike', $search)
                    ->orWhere('dat_file.filename', 'ilike', $search);
            });
        }

        $sortFields = [
            'calculated_at' => 'fault_locations.calculated_at',
            'ied_name' => 'ieds.name',
            'installation_name' => 'installations.name',
            'comtrade_record_id' => 'comtrade_records.id',
            'cfg_filename' => 'cfg_file.filename',
            'dat_filename' => 'dat_file.filename',
            'source' => 'comtrade_records.source',
            'fault_distance_km' => 'fault_locations.fault_distance_km',
            'status' => 'fault_locations.status',
        ];
        $sortKey = $params['sort'] ?? 'calculated_at';
        $sort = $sortFields[$sortKey] ?? $sortFields['calculated_at'];
        $direction = strtolower($params['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $pagination = $query
            ->orderBy($sort, $direction)
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $pagination->items(),
            'current_page' => $pagination->currentPage(),
            'last_page' => $pagination->lastPage(),
            'per_page' => $pagination->perPage(),
            'total' => $pagination->total(),
            'from' => $pagination->firstItem(),
            'to' => $pagination->lastItem(),
        ];
    }
}
