<?php

namespace OrigemPHP\Servicos\Usuarios;



use \Core\Session;
use \Controller\Chats;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Capsule\Manager as DB;

use OrigemPHP\Config\BaseController;

use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

use OrigemPHP\Servicos\Logs\Logs;
use Illuminate\Support\Collection;

use RobThree\Auth\TwoFactorAuth;


class Usuarios extends BaseController
{
    public static function buscarPorId($id)
    {
        return DB::table('users')
            ->select('id', 'name', 'email', 'enabled', 'last_login_at', 'created_at', 'updated_at')
            ->where('id', $id)
            ->first();
    }

    public static function buscarPorEmail($email)
    {
        return DB::table('users')
            ->select('id', 'name', 'email', 'enabled', 'last_login_at', 'created_at', 'updated_at')
            ->where('email', $email)
            ->first();
    }

    public static function listarModernos($request)
    {
        return DB::table('users')
            ->select('id', 'name', 'email', 'enabled', 'last_login_at', 'created_at', 'updated_at')
            ->orderBy('name')
            ->get();
    }

    public static function criarModerno(array $data)
    {
        $now = date('Y-m-d H:i:s');
        $id = DB::table('users')->insertGetId([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'enabled' => $data['enabled'] ?? true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::buscarPorId($id);
    }

    public static function atualizarModerno($id, array $data)
    {
        $update = [];
        foreach (['name', 'email', 'enabled'] as $field) {
            if (array_key_exists($field, $data)) {
                $update[$field] = in_array($field, ['name', 'email'], true)
                    ? trim($data[$field])
                    : $data[$field];
            }
        }

        if (!empty($data['password'])) {
            $update['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if ($update) {
            $update['updated_at'] = date('Y-m-d H:i:s');
            DB::table('users')->where('id', $id)->update($update);
        }

        return self::buscarPorId($id);
    }

    public static function alterarStatus($id, $enabled)
    {
        DB::table('users')->where('id', $id)->update([
            'enabled' => (bool) $enabled,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        return self::buscarPorId($id);
    }

    public static function carregarRoles($id)
    {
        return DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('user_roles.user_id', $id)
            ->where('roles.enabled', true)
            ->pluck('roles.slug')
            ->toArray();
    }

    public static function carregarPermissions($id)
    {
        return DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->join('role_permissions', 'roles.id', '=', 'role_permissions.role_id')
            ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
            ->where('user_roles.user_id', $id)
            ->where('roles.enabled', true)
            ->where('permissions.enabled', true)
            ->distinct()
            ->pluck('permissions.slug')
            ->toArray();
    }

    public static function trocarRoles($id, array $roleIds)
    {
        DB::table('user_roles')->where('user_id', $id)->delete();
        $now = date('Y-m-d H:i:s');

        foreach (array_unique($roleIds) as $roleId) {
            DB::table('user_roles')->insert([
                'user_id' => $id,
                'role_id' => $roleId,
                'created_at' => $now,
            ]);
        }

        return self::carregarRoles($id);
    }

    /** novo */
   public static function index($request){
        session_start();      
         $users = $_SESSION['users'] ?? [];
        return  BaseController::renderInertia('Usuario/Usuario', compact('users'));
    }

    public static function cadastrar_usuario($request)
    {
        session_start();
         $users = $_SESSION['users'] ?? [];

        $dados = $request->getPostVars();
        $pessoa = DB::table('pessoas')
            ->get();

        BaseController::renderView(
            'Usuarios/create',
            compact(
                'pessoa',
                'users'
            )
        );
    }

    public static function cadastrar_usuario_ed($request, $id)
    {
        session_start();
         $users = $_SESSION['users'] ?? [];

        $dados = $request->getPostVars();
        $pessoa = DB::table('pessoas')
            ->get();

        BaseController::renderView(
            'Usuarios/create',
            compact(
                'pessoa',
                'users',
                'id'
            )
        );
    }

    public static function cadastrar_salvar($request)
    {
        $dados = $request->getPostVars();


        try {


            $item = ['nome', 'nivel', 'status', 'id_pessoa', 'password', 'conf_password'];
            foreach ($item as $input) {
                if (!isset($dados[$input])) {
                    throw new \Exception("O campo '" . $input . "' e obrigatorio !", 400);
                }
            }

            if ($dados['password'] != $dados['conf_password']) {
                throw new \Exception("O campo senha não são iguais!", 400);
            }

            if ($dados['password'] == '' && $dados['conf_password'] == '') {
                throw new \Exception("O campo senha e confirmação são obrigatorio!", 400);
            }

            $senha = password_hash($dados['password'], PASSWORD_DEFAULT);

            $data = [
                'id_pessoa' => trim($dados['id_pessoa']),
                'usuario' => trim($dados['nome']),
                'password' => $senha,
                'nivel' => trim($dados['nivel']),
                'status' => trim($dados['status']),
                'ip' => $_SERVER["REMOTE_ADDR"],
                'id_usuario_now' => trim($dados['id_usuario_now']),
                'data_now' => date('Y-m-d H:m:s')
            ];

            $data_corrente = date('Y-m-d H:m:s');
            $ultimo_id = DB::table('users')
                ->insertGetId($data);


            if ($ultimo_id) {
                return [
                    "status" => "success",
                    "mensagem" => "Usuario salvo com successo!",
                    "registro" => $dados,
                ];
            }

            return [
                "status" => "error",
                "mensagem" => "Erro ao salvar Usuario!",
                "registro" => $dados,
            ];
        } catch (\Exception $e) {
            return [
                "status" => "error",
                "mensagem" => $e->getMessage(),
                "codigo" => $e->getCode()
            ];
        }
    }

    /** Atualizar */
    public static function atualizar_usuario($request, $id)
    {
        session_start();
         $users = $_SESSION['users'] ?? [];

        //     print_r($users);

        $input = "
                      pessoas.nome
                    , pessoas.id 
                    , pessoas.email
                    , pessoas.celular
                    , pessoas.endereco
                    , pessoas.numero
                    , pessoas.bairro
                    , pessoas.cep
                    , pessoas.cidade
                    , pessoas.estado
                    , users.usuario
                    , users.twofa_ativo
                    , users.google_secret
                    , users.nivel
                    , users.id_pessoa
                    , users.`status`
                    , users.id as registro_id
                    , users.data_now
                ";

        $usuario = DB::table('users')
            ->select(DB::raw($input))
            ->join('pessoas', 'users.id_pessoa', '=', 'pessoas.id')
            ->where('users.id', '=', $id)
            ->first();


        $pessoa = DB::table('pessoas')
            ->whereIn('tipo_pessoa', ['C', 'D', 'G', 'S', 'U', 'I'])
            ->get();

        $secret = $usuario->google_secret;
        $tfa = new TwoFactorAuth('KSSSoluções');
        $qrCode = $tfa->getQRCodeImageAsDataUri($usuario->email, $secret);

        BaseController::renderView(
            'Usuarios/edit',
            compact(
                'usuario',
                'pessoa',
                'users',
                'qrCode'
            )
        );
    }

    public static function atualizar_salvar($request)
    {

        session_start();
         $users = $_SESSION['users'] ?? [];

        $dados = $request->getPostVars();

        try {

            $antigo = DB::table('users')
                ->where('id', $dados['registro_id'])
                ->first();

            $antigo = json_decode(json_encode($antigo), true);

            $data = [
                'id_pessoa' => $dados['id_pessoa'],
                'usuario' => $dados['nome'],
                'nivel' => $dados['nivel'],
                'twofa_ativo' => (isset($dados['twofa_ativo']) && $dados['twofa_ativo'] == "1") ? 1 : 0,
                'status' => $dados['status'],
                'ip' => $_SERVER["REMOTE_ADDR"],
                'id_usuario_now' => (int) $users['id_pessoa']
            ];

            // Atualizando a senha se informado
            $password = trim($dados['password'] ?? '');
            $conf = trim($dados['conf_password'] ?? '');

            if ($password != '' || $conf != '') {

                // se um botão preencher e outro não
                if ($password === '' || $conf === '') {
                    return [
                        "status" => "error",
                        "mensagem" => "Informe a senha e a confirmação."
                    ];
                }

                if ($password !== $conf) {
                    return [
                        "status" => "error",
                        "mensagem" => "As senhas não coincidem!"
                    ];
                }

                $data['password'] = password_hash($password, PASSWORD_DEFAULT);
            }

            $up = DB::table('users')
                ->where('id', $dados['registro_id'])
                ->update($data);

            $novo = DB::table('users')
                ->where('id', $dados['registro_id'])
                ->first();

            $novo = json_decode(json_encode($novo), true);

            Logs::registrar('atualizou', 'users', $dados['registro_id'], $antigo, $novo, $dados);

            if ($up > 0) {
                return [
                    "status" => "success",
                    "mensagem" => "Usuário atualizado com sucesso!",
                    "alterado" => true,
                    "registro" => $data,
                ];
            }

            // 2) Executou mas nada mudou
            if ($up === 0) {
                return [
                    "status" => "warning",
                    "mensagem" => "Nada foi alterado. Os dados já estavam iguais.",
                    "alterado" => false,
                    "registro" => $data,
                ];
            }

        } catch (\Exception $e) {

            // 3) Erro real no banco
            return [
                "status" => "error",
                "mensagem" => "Erro ao atualizar o usuário.",
                "erro" => $e->getMessage(),
                "registro" => $data,
            ];
        }
    }

    /** */
    public static function listar_usuario_e_pessoas($request)
    {
        $queryParams = $request->getQueryParams();
        $pagina = $queryParams['page'] ?? 1;

        $pessoas = DB::table('pessoas')
            ->whereIn('tipo_pessoa', ['C', 'D', 'G', 'S'])
            ->get();


        $input = "pessoas.nome, pessoas.id as id_pessoas, LOWER(pessoas.email) as email, users.usuario, users.nivel, 
                  users.status, pessoas.tipo_pessoa
                  , users.id, users.data_now, CONCAT(
                    LEFT(SUBSTRING_INDEX(pessoas.nome, ' ', 1), 1),
                    IF(
                    LENGTH(SUBSTRING_INDEX(pessoas.nome, ' ', -1)) > 0 
                        AND SUBSTRING_INDEX(pessoas.nome, ' ', -1) != SUBSTRING_INDEX(pessoas.nome, ' ', 1),
                    LEFT(SUBSTRING_INDEX(pessoas.nome, ' ', -1), 1),
                    ''
                    )
                ) AS iniciais ";

        $users = DB::table('users')
            ->select(DB::raw($input))
            ->join('pessoas', 'users.id_pessoa', '=', 'pessoas.id');



        $where = Usuarios::aplicaFilters($queryParams);

        if (empty($where)) {
            $listapessoa = collect($users->paginate(10, ['*'], 'page', $pagina));
            BaseController::renderView(
                'Usuarios/index',
                compact('listapessoa', 'pessoas')
            );
            return;
        } else {

            foreach ($where as $filter) {
                $users->where(...$filter);
            }

            $listapessoa = collect($users->paginate(10, ['*'], 'page', $pagina));
            BaseController::renderView(
                'Usuarios/index',
                compact('listapessoa', 'pessoas')
            );
        }
    }

    public static function listar_usuario_e_pessoas_ajax($request)
    {
        $queryParams = $request->getQueryParams();
        $pagina = $queryParams['page'] ?? 1;

        $pessoas = DB::table('pessoas')
            ->get();


        $input = "pessoas.nome, pessoas.id as id_pessoas, LOWER(pessoas.email) as email, users.usuario, users.nivel, 
                  users.status, pessoas.tipo_pessoa
                  , users.id, users.data_now, CONCAT(
                    LEFT(SUBSTRING_INDEX(pessoas.nome, ' ', 1), 1),
                    IF(
                    LENGTH(SUBSTRING_INDEX(pessoas.nome, ' ', -1)) > 0 
                        AND SUBSTRING_INDEX(pessoas.nome, ' ', -1) != SUBSTRING_INDEX(pessoas.nome, ' ', 1),
                    LEFT(SUBSTRING_INDEX(pessoas.nome, ' ', -1), 1),
                    ''
                    )
                ) AS iniciais ";

        $users = DB::table('users')
            ->select(DB::raw($input))
            ->join('pessoas', 'users.id_pessoa', '=', 'pessoas.id');



        $where = Usuarios::aplicaFilters($queryParams);

        if (!empty($queryParams['nome'])) {

            $valor = '%' . $queryParams['nome'] . '%';

            $users->where(function ($q) use ($valor) {
                $q->where('pessoas.nome', 'like', $valor)
                    ->orWhere('pessoas.email', 'like', $valor)
                    ->orWhere('pessoas.nome_popular', 'like', $valor)
                    ->orWhere('users.usuario', 'like', $valor);
            });
        }

        if (empty($where)) {
            $listapessoa = collect($users->paginate(10, ['*'], 'page', $pagina));
            BaseController::renderView(
                'Usuarios/components/listaUsuarios',
                compact('listapessoa', 'pessoas')
            );
            return;
        } else {

            foreach ($where as $filter) {
                $users->where(...$filter);
            }

            $listapessoa = collect($users->paginate(10, ['*'], 'page', $pagina));
            BaseController::renderView(
                'Usuarios/components/listaUsuarios',
                compact('listapessoa', 'pessoas')
            );
        }
    }

    //API
    public static function listar_usuario_id_pessoas($request, $id)
    {
        $queryParams = $request->getQueryParams();

        $input = "id, id_pessoa, usuario, nivel, status";

        $users = DB::table('users')
            ->select(DB::raw($input))
            ->where('id_pessoa', '=', $id)
            ->first();


        return $users;
    }

    public static function listar_usuarioId($request, $id)
    {
        $user = DB::table('users')
            ->select('id', 'name', 'email', 'enabled')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return null;
        }

        return (object) [
            'id' => $user->id,
            'name' => $user->name,
            'nome' => $user->name,
            'email' => $user->email,
            'ativo' => $user->enabled ? 'active' : 'inactive',
        ];
    }

    public static function listar($request)
    {
        $queryParams = $request->getQueryParams();
        $pagina = $queryParams['page'] ?? 1;

        $input = "pessoas.nome, pessoas.nome_popular, users.id, users.id_pessoa, users.usuario, users.nivel, users.`status`";

        $users = DB::table('users')
            ->Join("pessoas", function ($join) {
                $join->on("users.id_pessoa", "=", "pessoas.id");
            })
            ->select(DB::raw($input));

        $where = Usuarios::aplicaFilters($queryParams);



        if (empty($where)) {
            $listapessoas = collect($users->paginate(10, ['*'], 'page', $pagina));
            return $listapessoas;
        }

        foreach ($where as $filter) {
            $users->where(...$filter);
        }

        $listapessoas = collect($users->paginate(10, ['*'], 'page', $pagina));
        return $listapessoas;
    }

    public static function lista($request)
    {
        $input = "users.usuario as label, users.id_pessoa as value";
        $users = DB::table('users')
            ->select(DB::raw($input))
            ->get();

        return $users;
    }

    public static function aplicaFilters(array $params): array
    {

        $where = [
            'usuario' => function ($data) {
                return ['users.usuario', 'like', '%' . $data . '%'];
            },
            'id_pessoa' => function ($data) {
                return ['users.id_pessoa', '=', $data];
            },
            'nivel' => function ($data) {
                return ['users.nivel', '=', $data];
            },
            'status' => function ($data) {
                return ['users.status', '=', $data];
            },
            'id' => function ($data) {
                return ['pessoas.id', '=', $data];
            },
            'data_now' => function ($data) {
                return ['users.data_now', '=', $data];
            }
        ];

        $params = array_filter($params, function ($where) {
            return $where !== '' && $where !== null;
        });

        $filters = [];
        foreach ($params as $key => $data) {
            if (array_key_exists($key, $where)) {
                $filters[] = $where[$key]($data);
            }
        }

        return $filters;
    }

    public static function deletar_usuario($id)
    {
        DB::table('users')
            ->where('id', '=', $id)
            ->delete();

        return true;
    }

}
