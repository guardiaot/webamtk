<?php

namespace OrigemPHP\Servicos\Agents;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Models\Agent;
use OrigemPHP\Servicos\Usuarios\Permissao;

class AgentsApi extends BaseController
{
    /**
     * ============================================================
     * LISTAR AGENTS
     * ============================================================
     */
    public static function listar($request)
    {
        Permissao::proteger('agents.view');
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

        $agents = DB::table('agents')
            ->select(
                'agents.id',
                'agents.name',
                'agents.version',
                'agents.created_at',
                'agents.updated_at'
            );

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
            $agents->where(function ($q) use ($search) {
                $q->where('agents.id', 'like', $search)
                    ->orWhere('agents.name', 'like', $search)
                    ->orWhere('agents.version', 'like', $search);
            });
        }

        $agents->orderBy('agents.name', 'asc');

        return collect(
            $agents->paginate(
                $perPage,
                ['*'],
                'page',
                $pagina
            )
        );
    }

    /**
     * ============================================================
     * LISTAR AGENTS (simples, para selects)
     * ============================================================
     */
    public static function listarSimples($request)
    {
        Permissao::proteger('agents.view');
        return DB::table('agents')
            ->select(
                'agents.id',
                'agents.name',
                'agents.version'
            )
            ->orderBy('agents.name', 'asc')
            ->get();
    }

    /**
     * ============================================================
     * CRIAR AGENT
     * ============================================================
     */
    public static function criar($request)
    {
        Permissao::proteger('agents.manage');
        $dados = $request->getPostVars();

        if (empty($dados['id']) || empty($dados['name'])) {
            return [
                'erro' => 1,
                'mensagem' => 'ID e nome são obrigatórios.'
            ];
        }

        if (Agent::where('id', $dados['id'])->exists()) {
            return [
                'erro' => 1,
                'mensagem' => 'Agent já cadastrado: ' . $dados['id']
            ];
        }

        $agent = Agent::create([
            'id' => $dados['id'],
            'name' => $dados['name'],
            'version' => $dados['version'] ?? '1.0.0',
        ]);

        return [
            'erro' => 0,
            'mensagem' => 'Agent cadastrado com sucesso.',
            'data' => $agent
        ];
    }

    /**
     * ============================================================
     * ATUALIZAR AGENT
     * ============================================================
     */
    public static function atualizar($request, $id)
    {
        Permissao::proteger('agents.manage');
        $dados = $request->getPostVars();

        $agent = Agent::where('id', $id)->first();

        if (!$agent) {
            return [
                'erro' => 1,
                'mensagem' => 'Agent não encontrado.'
            ];
        }

        $agent->update([
            'name' => $dados['name'] ?? $agent->name,
            'version' => $dados['version'] ?? $agent->version,
        ]);

        return [
            'erro' => 0,
            'mensagem' => 'Agent atualizado com sucesso.',
            'data' => $agent
        ];
    }

    /**
     * ============================================================
     * EXCLUIR AGENT
     * ============================================================
     */
    public static function excluir($request, $id)
    {
        Permissao::proteger('agents.manage');
        $agent = Agent::where('id', $id)->first();

        if (!$agent) {
            return [
                'erro' => 1,
                'mensagem' => 'Agent não encontrado.'
            ];
        }

        $agent->delete();

        return [
            'erro' => 0,
            'mensagem' => 'Agent excluído com sucesso.'
        ];
    }
}
