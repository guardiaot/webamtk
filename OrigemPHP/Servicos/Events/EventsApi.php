<?php

namespace OrigemPHP\Servicos\Events;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class EventsApi extends BaseController
{
    /**
     * ============================================================
     * LISTAR EVENTOS
     * ============================================================
     *
     * Parâmetros:
     * - page
     * - per_page
     * - ied_id
     * - status
     * - severity
     * - data_inicial
     * - data_final
     * - search
     */
    public static function listar($request)
    {
        Permissao::proteger('events.view');
        $queryParams = $request->getQueryParams();

        $pagina = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? 15);

        if ($pagina < 1) {
            $pagina = 1;
        }
        if ($perPage < 1) {
            $perPage = 15;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }

        $events = DB::table('events')
            ->select(
                'events.id',
                'events.agent_id',
                'events.ied_id',
                'events.type',
                'events.status',
                'events.message',
                'events.timestamp',
                'events.created_at',
                'ieds.name as ied_name',
                'ieds.manufacturer',
                'ieds.source',
                'ieds.model'
            )
            ->leftJoin(
                'ieds',
                'events.ied_id',
                '=',
                'ieds.id'
            );

        /*
         * ========================================================
         * FILTRO IED
         * ========================================================
         */
        if (
            isset($queryParams['ied_id']) &&
            trim($queryParams['ied_id']) !== ''
        ) {
            $events->where(
                'events.ied_id',
                '=',
                trim($queryParams['ied_id'])
            );
        }

        /*
         * ========================================================
         * FILTRO STATUS
         * ========================================================
         */
        if (
            isset($queryParams['status']) &&
            trim($queryParams['status']) !== ''
        ) {
            $events->where(
                'events.status',
                '=',
                trim($queryParams['status'])
            );
        }

        /*
         * ========================================================
         * FILTRO SEVERIDADE (type)
         * ========================================================
         */
        if (
            isset($queryParams['severity']) &&
            trim($queryParams['severity']) !== ''
        ) {
            $events->where(
                'events.type',
                '=',
                trim($queryParams['severity'])
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
            $events->where(
                'events.timestamp',
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
            $events->where(
                'events.timestamp',
                '<=',
                trim($queryParams['data_final']) . ' 23:59:59'
            );
        }

        /*
         * ========================================================
         * BUSCA GERAL
         * ========================================================
         */
        if (
            isset($queryParams['search']) &&
            trim($queryParams['search']) !== ''
        ) {
            $search = '%' . trim($queryParams['search']) . '%';
            $events->where(function ($q) use ($search) {
                $q->where('events.message', 'like', $search)
                    ->orWhere('events.type', 'like', $search)
                    ->orWhere('ieds.name', 'like', $search);
            });
        }

        /*
         * ========================================================
         * ORDENAÇÃO
         * ========================================================
         */
        $events->orderByDesc('events.timestamp');

        /*
         * ========================================================
         * PAGINAÇÃO
         * ========================================================
         */
        return collect(
            $events->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            )
        );
    }

    /**
     * ============================================================
     * RESUMO DE EVENTOS
     * ============================================================
     */
    public static function resumo($request)
    {
        Permissao::proteger('events.view');
        $queryParams = $request->getQueryParams();
        $events = DB::table('events');

        if (($queryParams['ied_id'] ?? '') !== '') $events->where('events.ied_id', trim($queryParams['ied_id']));
        if (($queryParams['status'] ?? '') !== '') $events->where('events.status', trim($queryParams['status']));
        if (($queryParams['severity'] ?? '') !== '') $events->where('events.type', trim($queryParams['severity']));
        if (($queryParams['data_inicial'] ?? '') !== '') $events->where('events.timestamp', '>=', trim($queryParams['data_inicial']));
        if (($queryParams['data_final'] ?? '') !== '') $events->where('events.timestamp', '<=', trim($queryParams['data_final']) . ' 23:59:59');
        $search = trim((string) ($queryParams['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $events->leftJoin('ieds', 'events.ied_id', '=', 'ieds.id')->where(function ($q) use ($like) {
                $q->where('events.message', 'like', $like)->orWhere('events.type', 'like', $like)->orWhere('ieds.name', 'like', $like);
            });
        }

        $total = (clone $events)->count('events.id');

        $active = (clone $events)
            ->whereIn('events.status', ['active', 'open'])
            ->count();

        $critical = (clone $events)
            ->where('events.type', 'critical')
            ->count();

        $warning = (clone $events)
            ->where('events.type', 'warning')
            ->count();

        $resolved = (clone $events)
            ->where('events.status', 'resolved')
            ->count();

        return [
            'total' => $total,
            'active' => $active,
            'critical' => $critical,
            'warning' => $warning,
            'resolved' => $resolved
        ];
    }
}
