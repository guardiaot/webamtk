<?php

namespace OrigemPHP\Servicos\Logs;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class SystemLogsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('audit.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = DB::table('system_logs')->select('id', 'level', 'module', 'message', 'route', 'context', 'created_at');

        if (($params['level'] ?? '') !== '') $query->where('level', trim($params['level']));
        if (($params['module'] ?? '') !== '') $query->where('module', trim($params['module']));
        if (($params['data_inicial'] ?? '') !== '') $query->where('created_at', '>=', trim($params['data_inicial']));
        if (($params['data_final'] ?? '') !== '') $query->where('created_at', '<=', trim($params['data_final']) . ' 23:59:59');

        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('message', 'ilike', $like)->orWhere('module', 'ilike', $like)->orWhere('level', 'ilike', $like)->orWhere('route', 'ilike', $like);
            });
        }

        $pagination = $query->orderByDesc('created_at')->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $pagination->total(), 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem()];
    }
}
