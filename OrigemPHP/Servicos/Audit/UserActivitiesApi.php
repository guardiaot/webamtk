<?php

namespace OrigemPHP\Servicos\Audit;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class UserActivitiesApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('audit.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('user_activities')
            ->leftJoin('users', 'user_activities.user_id', '=', 'users.id')
            ->select('user_activities.id', 'user_activities.user_id', 'users.name as user_name', 'users.email as user_email', 'user_activities.action', 'user_activities.module', 'user_activities.entity_type', 'user_activities.entity_id', 'user_activities.description', 'user_activities.http_method', 'user_activities.route', 'user_activities.ip_address', 'user_activities.user_agent', 'user_activities.metadata', 'user_activities.created_at');

        foreach (['user_id' => 'user_activities.user_id', 'action' => 'user_activities.action', 'module' => 'user_activities.module'] as $key => $column) {
            if (($params[$key] ?? '') !== '') $query->where($column, trim($params[$key]));
        }
        if (($params['data_inicial'] ?? '') !== '') $query->where('user_activities.created_at', '>=', trim($params['data_inicial']));
        if (($params['data_final'] ?? '') !== '') $query->where('user_activities.created_at', '<=', trim($params['data_final']) . ' 23:59:59');
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('user_activities.description', 'ilike', $like)->orWhere('user_activities.action', 'ilike', $like)->orWhere('user_activities.module', 'ilike', $like)->orWhere('user_activities.entity_type', 'ilike', $like)->orWhere('user_activities.entity_id', 'ilike', $like)->orWhere('users.name', 'ilike', $like)->orWhere('users.email', 'ilike', $like);
            });
        }
        $pagination = $query->orderByDesc('user_activities.created_at')->orderByDesc('user_activities.id')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $pagination->total(), 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem()];
    }
}
