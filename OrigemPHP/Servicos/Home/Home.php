<?php

namespace OrigemPHP\Servicos\Home;



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

class Home extends BaseController
{


        public static function Home($request)
        {
                session_start();
                $users = $_SESSION['users'] ?? [];

                return BaseController::renderInertia(
                        'Home/index',
                        [
                                'users' => $users
                        ]
                );
        }

        ### Método `dashboard`


        public static function informacoes($request)
        {
                $queryParams = $request->getQueryParams();
                $iedId = trim((string) ($queryParams['ied_id'] ?? ''));
                $period = trim((string) ($queryParams['period'] ?? '7d'));
                if (!in_array($period, ['today', '24h', '7d', '30d'], true)) {
                        $period = '7d';
                }

                $eventStart = null;
                if ($period === 'today') {
                        $eventStart = Carbon::now()->startOfDay();
                } elseif ($period === '24h') {
                        $eventStart = Carbon::now()->subHours(24);
                } elseif ($period === '7d') {
                        $eventStart = Carbon::now()->subDays(7);
                } elseif ($period === '30d') {
                        $eventStart = Carbon::now()->subDays(30);
                }

                /*
                 * ============================================================
                 * IEDS
                 * ============================================================
                 */

                $ieds = DB::table('ieds')
                        ->select(
                                'id',
                                'agent_id',
                                'name',
                                'manufacturer',
                                'model',
                                'host',
                                'port',
                                'status',
                                'response_time_us',
                                'last_check',
                                'last_seen',
                                'failures',
                                'checks',
                                'consecutive_failures'
                        )
                        ->orderBy('name')
                        ->when($iedId !== '', function ($query) use ($iedId) {
                                $query->where('id', $iedId);
                        })
                        ->get();


                $totalIeds = $ieds->count();

                $onlineIeds = $ieds->where(
                        'status',
                        'online'
                )->count();

                $offlineIeds = $ieds->where(
                        'status',
                        'offline'
                )->count();


                /*
                 * ============================================================
                 * TELEMETRIA
                 *
                 * Última leitura de cada IED
                 * ============================================================
                 */

                $telemetry = collect();

                foreach ($ieds as $ied) {

                        $reading = DB::table('telemetry')
                                ->select(
                                        'id',
                                        'ied_id',
                                        'timestamp',
                                        'ia',
                                        'ib',
                                        'ic',
                                        'va',
                                        'vb',
                                        'vc',
                                        'frequency'
                                )
                                ->where(
                                        'ied_id',
                                        $ied->id
                                )
                                ->orderByDesc(
                                        'timestamp'
                                )
                                ->first();

                        if ($reading) {
                                $telemetry->push($reading);
                        }
                }


                /*
                 * ============================================================
                 * EVENTOS
                 * ============================================================
                 */

                $eventsQuery = DB::table('events');
                if ($iedId !== '') {
                        $eventsQuery->where('ied_id', $iedId);
                }
                if ($eventStart !== null) {
                        $eventsQuery->where('timestamp', '>=', $eventStart->toDateTimeString());
                }

                $eventsTotal = (clone $eventsQuery)
                        ->count();

                $eventsActive = (clone $eventsQuery)
                        ->whereIn(
                                'status',
                                [
                                        'active',
                                        'open'
                                ]
                        )
                        ->count();


                $events = (clone $eventsQuery)
                        ->select(
                                'id',
                                'agent_id',
                                'ied_id',
                                'type',
                                'status',
                                'message',
                                'timestamp'
                        )
                        ->orderByDesc(
                                'timestamp'
                        )
                        ->limit(10)
                        ->get();

                $eventsSeverity = (clone $eventsQuery)
                        ->select('type', DB::raw('COUNT(*) as total'))
                        ->groupBy('type')
                        ->get();
                $eventsSeveritySummary = [
                        'critical' => 0,
                        'warning' => 0,
                        'info' => 0,
                        'other' => 0
                ];
                foreach ($eventsSeverity as $eventSeverity) {
                        $type = in_array($eventSeverity->type, ['critical', 'warning', 'info'], true) ? $eventSeverity->type : 'other';
                        $eventsSeveritySummary[$type] += (int) $eventSeverity->total;
                }


                /*
                 * ============================================================
                 * AGENTS
                 * ============================================================
                 */

                $agents = DB::table('agents')
                        ->select(
                                'id',
                                'name',
                                'version',
                                'created_at',
                                'updated_at'
                        )
                        ->orderBy('name')
                        ->get();


                /*
                 * ============================================================
                 * RETORNO
                 * ============================================================
                 */

                return [
                        'summary' => [
                                'ieds' => $totalIeds,
                                'online' => $onlineIeds,
                                'offline' => $offlineIeds,
                                'events' => $eventsTotal,
                                'events_active' => $eventsActive,
                                'agents' => $agents->count()
                        ],

                        'telemetry' => $telemetry,
                        'ieds' => $ieds,
                        'events' => $events,
                        'events_severity' => $eventsSeveritySummary,
                        'agents' => $agents
                ];
        }




}
