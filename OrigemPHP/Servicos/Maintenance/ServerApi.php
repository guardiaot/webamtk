<?php

namespace OrigemPHP\Servicos\Maintenance;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class ServerApi extends BaseController
{
    public static function resumo($request)
    {
        Permissao::proteger('server.view');

        $application = [
            'status' => 'available',
            'php_version' => PHP_VERSION,
            'server_time' => date('c'),
            'timezone' => date_default_timezone_get(),
        ];

        $database = [
            'status' => 'error',
            'version' => null,
            'database_name' => null,
            'response_time_ms' => null,
            'message' => 'Não foi possível consultar o banco de dados.',
        ];

        try {
            $startedAt = microtime(true);
            $databaseInfo = DB::selectOne(
                'SELECT version() AS version, current_database() AS database_name'
            );
            $database['status'] = 'online';
            $database['version'] = $databaseInfo->version ?? null;
            $database['database_name'] = $databaseInfo->database_name ?? null;
            $database['response_time_ms'] = round((microtime(true) - $startedAt) * 1000, 2);
            unset($database['message']);
        } catch (\Throwable $e) {
        }

        try {
            $ultimaTelemetria = DB::table('telemetry')->max('timestamp');
        } catch (\Throwable $e) {
            $ultimaTelemetria = null;
        }

        try {
            $ultimoEvento = DB::table('events')->max('timestamp');
        } catch (\Throwable $e) {
            $ultimoEvento = null;
        }

        $ultimaAtividade = $ultimaTelemetria;
        if ($ultimaAtividade === null || ($ultimoEvento !== null && $ultimoEvento > $ultimaAtividade)) {
            $ultimaAtividade = $ultimoEvento;
        }

        $totalIeds = DB::table('ieds')->count();
        $iedsOnline = DB::table('ieds')->where('status', 'online')->count();
        $iedsOffline = DB::table('ieds')->where('status', 'offline')->count();

        return [
            'application' => $application,
            'database' => $database,
            'activity' => [
                'ultima_telemetria' => $ultimaTelemetria,
                'ultimo_evento' => $ultimoEvento,
                'ultima_atividade' => $ultimaAtividade,
            ],
            'summary' => [
                'total_agents' => DB::table('agents')->count(),
                'total_ieds' => $totalIeds,
                'ieds_online' => $iedsOnline,
                'ieds_offline' => $iedsOffline,
                'ieds_unknown' => $totalIeds - $iedsOnline - $iedsOffline,
            ],
        ];
    }
}
