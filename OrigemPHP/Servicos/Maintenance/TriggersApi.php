<?php

namespace OrigemPHP\Servicos\Maintenance;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class TriggersApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('oscillography.view');

        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));

        $query = DB::table('comtrade_records')
            ->join('ieds', 'comtrade_records.ied_id', '=', 'ieds.id')
            ->select(
                'comtrade_records.id',
                'comtrade_records.ied_id',
                'ieds.name as ied_name',
                'ieds.code as ied_code',
                'ieds.manufacturer',
                'ieds.model',
                'comtrade_records.station_name',
                'comtrade_records.device_id',
                'comtrade_records.trigger_time',
                'comtrade_records.cfg_filename',
                'comtrade_records.dat_filename',
                'comtrade_records.source'
            )
            ->whereNotNull('comtrade_records.trigger_time');

        if (!empty($params['ied_id'])) {
            $query->where('comtrade_records.ied_id', $params['ied_id']);
        }

        if (!empty($params['data_inicial'])) {
            $query->where('comtrade_records.trigger_time', '>=', trim($params['data_inicial']) . ' 00:00:00');
        }

        if (!empty($params['data_final'])) {
            $query->where('comtrade_records.trigger_time', '<=', trim($params['data_final']) . ' 23:59:59');
        }

        if (!empty($params['search'])) {
            $search = '%' . trim($params['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('ieds.name', 'ilike', $search)
                    ->orWhere('ieds.code', 'ilike', $search)
                    ->orWhere('ieds.manufacturer', 'ilike', $search)
                    ->orWhere('ieds.model', 'ilike', $search)
                    ->orWhere('comtrade_records.station_name', 'ilike', $search)
                    ->orWhere('comtrade_records.device_id', 'ilike', $search)
                    ->orWhere('comtrade_records.cfg_filename', 'ilike', $search)
                    ->orWhere('comtrade_records.dat_filename', 'ilike', $search)
                    ->orWhere('comtrade_records.source', 'ilike', $search);
            });
        }

        $sortFields = [
            'trigger_time' => 'comtrade_records.trigger_time',
            'ied_name' => 'ieds.name',
            'manufacturer' => 'ieds.manufacturer',
            'model' => 'ieds.model',
            'station_name' => 'comtrade_records.station_name',
            'device_id' => 'comtrade_records.device_id',
            'cfg_filename' => 'comtrade_records.cfg_filename',
            'dat_filename' => 'comtrade_records.dat_filename',
            'source' => 'comtrade_records.source',
        ];
        $sortParam = $params['sort'] ?? '';
        $directionParam = strtolower((string) ($params['direction'] ?? ''));
        $validSort = isset($sortFields[$sortParam]);
        $validDirection = in_array($directionParam, ['asc', 'desc'], true);
        $sort = $validSort && $validDirection ? $sortFields[$sortParam] : 'comtrade_records.trigger_time';
        $direction = $validSort && $validDirection ? $directionParam : 'desc';

        return $query
            ->orderBy($sort, $direction)
            ->orderByDesc('comtrade_records.id')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
