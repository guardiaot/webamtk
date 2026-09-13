<?php

namespace OrigemPHP\Servicos\Monitoring;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class MonitoringApi extends BaseController
{
    public static function resumo($request)
    {
        Permissao::proteger('monitoring.view');

        $iedStats = DB::table('ieds')
            ->select(
                'ieds.agent_id',
                DB::raw('COUNT(*) as total_ieds'),
                DB::raw("COUNT(*) FILTER (WHERE ieds.status = 'online') as ieds_online"),
                DB::raw("COUNT(*) FILTER (WHERE ieds.status = 'offline') as ieds_offline"),
                DB::raw("COUNT(*) FILTER (WHERE ieds.status IS NULL OR ieds.status NOT IN ('online', 'offline')) as ieds_unknown")
            )
            ->groupBy('ieds.agent_id');

        $telemetryStats = DB::table('telemetry')
            ->select(
                'telemetry.agent_id',
                DB::raw('MAX(telemetry.timestamp) as ultima_telemetria')
            )
            ->groupBy('telemetry.agent_id');

        $eventStats = DB::table('events')
            ->select(
                'events.agent_id',
                DB::raw('MAX(events.timestamp) as ultimo_evento')
            )
            ->groupBy('events.agent_id');

        $agents = DB::table('agents')
            ->leftJoinSub($iedStats, 'ied_stats', function ($join) {
                $join->on('agents.id', '=', 'ied_stats.agent_id');
            })
            ->leftJoinSub($telemetryStats, 'telemetry_stats', function ($join) {
                $join->on('agents.id', '=', 'telemetry_stats.agent_id');
            })
            ->leftJoinSub($eventStats, 'event_stats', function ($join) {
                $join->on('agents.id', '=', 'event_stats.agent_id');
            })
            ->select(
                'agents.id',
                'agents.name',
                'agents.version',
                DB::raw('COALESCE(ied_stats.total_ieds, 0) as total_ieds'),
                DB::raw('COALESCE(ied_stats.ieds_online, 0) as ieds_online'),
                DB::raw('COALESCE(ied_stats.ieds_offline, 0) as ieds_offline'),
                DB::raw('COALESCE(ied_stats.ieds_unknown, 0) as ieds_unknown'),
                'telemetry_stats.ultima_telemetria',
                'event_stats.ultimo_evento',
                DB::raw("
                    CASE
                        WHEN telemetry_stats.ultima_telemetria IS NULL THEN event_stats.ultimo_evento
                        WHEN event_stats.ultimo_evento IS NULL THEN telemetry_stats.ultima_telemetria
                        WHEN telemetry_stats.ultima_telemetria >= event_stats.ultimo_evento THEN telemetry_stats.ultima_telemetria
                        ELSE event_stats.ultimo_evento
                    END as ultima_atividade
                ")
            )
            ->orderBy('agents.name')
            ->get();

        $iedSummary = DB::table('ieds')
            ->select(
                DB::raw('COUNT(*) as total_ieds'),
                DB::raw("COUNT(*) FILTER (WHERE status = 'online') as ieds_online"),
                DB::raw("COUNT(*) FILTER (WHERE status = 'offline') as ieds_offline"),
                DB::raw("COUNT(*) FILTER (WHERE status IS NULL OR status NOT IN ('online', 'offline')) as ieds_unknown")
            )
            ->first();

        return [
            'agents' => $agents,
            'summary' => [
                'total_agents' => DB::table('agents')->count(),
                'total_ieds' => $iedSummary->total_ieds ?? 0,
                'ieds_online' => $iedSummary->ieds_online ?? 0,
                'ieds_offline' => $iedSummary->ieds_offline ?? 0,
                'ieds_unknown' => $iedSummary->ieds_unknown ?? 0,
            ],
        ];
    }
}

