<?php

namespace OrigemPHP\Config;

use PDO;
use OrigemPHP\Config\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

use OrigemPHP\Config\BaseController;

use OrigemPHP\Servicos\Logs\Logs;
use OrigemPHP\Servicos\Imagens\Imagem;


class Helpers extends BaseController
{

    private static $result;
    private $Select;
    private static $Places = [];
    private $Result;
    private $Read;
    private $Conn;

    public static function fromCamelCase($str)
    {
        $string = str_replace('_', '/', $str);
        return strtoupper($string);
    }

    public static function sql_trim($sql)
    {
        return str_replace(array('  ', "\t", "\n", "\r"), ' ', $sql);
    }

    public static function get_ativacao()
    {

        $retorno = DB::table('corretor')
            ->where('flag_liberacao', 3)
            ->get();


        return count($retorno);

    }

    public static function contaColaborador($id_pessoa)
    {
        $colaborador = DB::table('corretor')
            ->where('id_imobiliaria', '=', $id_pessoa)
            ->count();

        return $colaborador;
    }

    public static function contaProduto($id_pessoa)
    {
        $colaborador = DB::table('api_clientes_produtos')
            ->where('id_imobiliaria', '=', $id_pessoa)
            ->count();

        return $colaborador;
    }

    public static function contaProdutoDesabilitado($id_pessoa)
    {
        $colaborador = DB::table('api_clientes_produtos')
            ->where('id_imobiliaria', '=', $id_pessoa)
            ->where('flag_inativo', '=', 2)
            ->count();

        return $colaborador;
    }

    public static function contaProdutoHml($id_pessoa)
    {
        $colaborador = DB::table('api_clientes_produtos')
            ->where('id_imobiliaria', '=', $id_pessoa)
            ->where('homologacao', '=', 'S')
            ->where('flag_inativo', '=', 1)
            ->count();

        return $colaborador;
    }

     public static function contaProdutoProd($id_pessoa)
    {
        $colaborador = DB::table('api_clientes_produtos')
            ->where('id_imobiliaria', '=', $id_pessoa)
            ->where('homologacao', '=', 'N')
            ->where('flag_inativo', '=', 1)
            ->count();

        return $colaborador;
    }

    public static function contaUsuarios($id_pessoa)
    {
        $colaborador = DB::table('users')
            ->where('id_pessoa', '=', $id_pessoa)
            ->count();

        return $colaborador;
    }

    public static function set_active($paths, $activeClass = 'active open')
    {
        // Instancia o Request (sem precisar do Router)
        $request = new Request(null);

        // Captura apenas o caminho da URL atual (sem query string)
        $current = rtrim($request->getUri(), '/');
        if ($current === '') {
            $current = '/';
        }

        // Suporta múltiplos caminhos
        if (is_array($paths)) {
            foreach ($paths as $path) {
                if (self::matchPath($path, $current)) {
                    return $activeClass;
                }
            }
            return '';
        }

        return self::matchPath($paths, $current) ? $activeClass : '';
    }

    private static function matchPath($path, $current)
    {
        // remove barra final
        $path = rtrim($path, '/');

        // suporte a curingas, ex: "painel/usuarios*"
        $pattern = '/^' . str_replace('*', '.*', preg_quote($path, '/')) . '$/';

        return preg_match($pattern, $current);
    }


    public static function get_public()
    {
        return $_ENV["PUBLIC_PATH"];
    }

    public static function get_path()
    {
        return $_ENV["PATH_APP"];
    }

    public static function get_api()
    {
        return $_ENV["API"];
    }

    public static function getUrl()
    {
        return $_ENV["URL"];
    }

    public static function get_url_api()
    {
        return $_ENV["API_URL"];
    }

    public static function get_titulo_site()
    {
        return $_ENV["TITULO_SITE"];
    }

    public static function get_nome_sistema()
    {
        return $_ENV["NOME_SISTEMA"];
    }


    public static function config()
    {
        $config = DB::table('config')->first();

        return $config;
    }


    public static function cria_json($caminho, $nome, $json)
    {
        $filename = date("Ymd") . mt_rand(5, 8) . time() . $nome . '.json';

        $arquivo = fopen(Helpers::get_public() . $caminho . $filename, "w+");
        fwrite($arquivo, $json);
        fclose($arquivo);

        return $caminho . $filename;
    }

    



    #
    #
    #
    #
    #CALCULA DIAS
    public static function calculadias($data_inicial, $data_final)
    {
        // Usa a função strtotime() e pega o timestamp das duas datas:
        $time_inicial = strtotime($data_inicial);
        $time_final = strtotime($data_final);

        // Calcula a diferença de segundos entre as duas datas:
        $diferenca = $time_final - $time_inicial; // 19522800 segundos

        // Calcula a diferença de dias
        $dias = (int) floor($diferenca / (60 * 60 * 24)); // 225 dias

        // Exibe uma mensagem de resultado:
        return self::$result = $dias;
    }

    #FORMATA CPF OU CNPJ
    public static function cnpjcpf($cnpj)
    {
        if (strlen($cnpj) == 15) {
            $p1 = substr($cnpj, 0, 3);
            $p2 = substr($cnpj, 3, 3);
            $p3 = substr($cnpj, 6, 3);
            $p4 = substr($cnpj, 9, 4);
            $p5 = substr($cnpj, -2);

            return self::$result = $p1 . '.' . $p2 . '.' . $p3 . '/' . $p4 . '-' . $p5;
        } else if (strlen($cnpj) == 11) {

            $p1 = substr($cnpj, 0, 3);
            $p2 = substr($cnpj, 3, 3);
            $p3 = substr($cnpj, 6, 3);
            $p4 = substr($cnpj, -2);

            return self::$result = $p1 . '.' . $p2 . '.' . $p3 . '-' . $p4;
        }
    }

    #MES POR EXTENÇO
    public static function mesextenco($mes)
    {
        switch ($mes) {
            case "01":
                $mes = "Janeiro";
                break;
            case "02":
                $mes = "Fevereiro";
                break;
            case "03":
                $mes = "Março";
                break;
            case "04":
                $mes = "Abril";
                break;
            case "05":
                $mes = "Maio";
                break;
            case "06":
                $mes = "Junho";
                break;
            case "07":
                $mes = "Julho";
                break;
            case "08":
                $mes = "Agosto";
                break;
            case "09":
                $mes = "Setembro";
                break;
            case "10":
                $mes = "Outubro";
                break;
            case "11":
                $mes = "Novembro";
                break;
            case "12":
                $mes = "Dezembro";
                break;
        }
        return self::$result = $mes;
    }

    #MOEDA
    public static function moeda($valor)
    {
        return self::$result = number_format($valor, 2, ',', '.');
    }

    #MOEDA2
    public static function moeda2($valor)
    {
        return self::$result = number_format($valor, 7, ',', '.');
    }

    #VIRGULA
    public static function virgula($valor)
    {
        return self::$result = str_replace(".", ",", $valor);
    }

    #PONTO
    public static function ponto($valor)
    {
        return self::$result = str_replace(",", ".", $valor);
    }

    #TIRA SINAL NEGATIVO DE INTEIRO
    public static function negativo($valor)
    {
        return self::$result = str_replace("-", "", $valor);
    }

    #GRAVA NO BANCO TIPO FLOAT
    public static function vfloat($valor)
    {
        $array = explode(",", $valor);
        $um = str_replace(".", "", $array[0]);
        $novo = $um . '.' . $array[1];

        return self::$result = $novo;
    }

    #ENTER EM AREA DE TEXTO
    public static function enter($string)
    {
        $string = str_replace(array("\r\n", "\r", "\n"), "<br>", $string);
        return self::$result = $string;
    }

    #ENTER EM AREA DE TEXTO
    public static function enter2($string)
    {
        $string = str_replace('<br>', "\n", $string);
        return self::$result = $string;
    }

    #SENHA ENCODE
    public static function senha_encode($senha)
    {
        return self::$result = base64_encode(base64_encode(base64_encode(base64_encode($senha))));
    }

    #SENHA DECODE
    public static function senha_decode($senha)
    {
        return self::$result = base64_decode(base64_decode(base64_decode(base64_decode($senha))));
    }

    #DATA BARRA TRAÇO
    public static function data_barra($data)
    {
        return self::$result = str_replace("/", "-", $data);
    }

    #DATA EUA
    public static function data_eua()
    {
        return self::$result = date("Y-m-d");
    }

    #DATA BRASIL
    /*
    public static function data_br(){
        return self::$result = date("d/m/Y");

    }*/

    public static function data_br($data)
    {
        return date("d/m/Y H:i:s", strtotime($data));
    }

    #DATA HORA
    public static function data_hora()
    {
        return self::$result = date("Y-m-d H:i:s");
    }

    #DATA BRASIL EUA
    public static function data_brasil_eua($data)
    {
        $array = explode("/", $data);

        return self::$result = $array[2] . '-' . $array[1] . '-' . $array[0];
    }

    #DATA EUA BRASIL
    public static function data_eua_brasil($data)
    {
        $data = (isset($data) ? $data : Date('Y-m-d'));

        $array = explode("-", $data);

        return self::$result = $array[2] . '/' . $array[1] . '/' . $array[0];
    }

    #DATA E HORA EUA BRASIL
    public static function data_hora_eua_brasil($data)
    {
        $array = explode(" ", $data);
        $hora = $array[1];
        $array2 = explode("-", $array[0]);
        return self::$result = $array2[2] . '/' . $array2[1] . '/' . $array2[0] . ' ' . $hora;
    }

    #DATA E HORA EUA BRASIL
    public static function data_hora_brasil_eua($data1)
    {
        $array1 = explode(" ", $data1);
        $hora1 = $array1[1];
        $array21 = explode("/", $array1[0]);
        return self::$result = $array21[2] . '-' . $array21[1] . '-' . $array21[0] . ' ' . $hora1;
    }

    #REMOVER ACENTOS
    public static function remover_acentos($string)
    {
        // Converte todos os caracteres para minusculo 
        $string = strtolower($string);
        // Remove os acentos 
        $string = preg_replace('[aáàãâä]', 'a', $string);
        $string = preg_replace('[eéèêë]', 'e', $string);
        $string = preg_replace('[iíìîï]', 'i', $string);
        $string = preg_replace('[oóòõôö]', 'o', $string);
        $string = preg_replace('[uúùûü]', 'u', $string);
        // Remove o cedilha e o ñ 
        $string = preg_replace('[ç]', 'c', $string);
        $string = preg_replace('[ñ]', 'n', $string);
        // Substitui os espaços em brancos por underline 
        //$string = preg_replace('( )', '_', $string); 
        // Remove hifens duplos 
        //$string = preg_replace('--', '_', $string); 
        return self::$result = $string;
    }

    #TAMANHO AQUIVO
    public static function tamanho($Url)
    {
        $N = array('Bytes', 'KB', 'MB', 'GB');
        $Tam = filesize($Url);
        for ($Pos = 0; $Tam >= 1024; $Pos++) {
            $Tam /= 1024;
        }
        return self::$result = @round($Tam, 2) . " " . $N[$Pos];
    }


    public static function formatarBytes($bytes, int $casas = 2): string
    {
        if (!is_numeric($bytes) || $bytes <= 0) {
            return '0 B';
        }

        $bytes = (float) $bytes;

        $unidades = ['B', 'KB', 'MB', 'GB', 'TB'];

        $i = 0;

        while ($bytes >= 1024 && $i < count($unidades) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, $casas) . ' ' . $unidades[$i];
    }

    public static function obter_data_hora_amigavel($data)
    {
        if ($data == null || trim($data) == '') {
            return '';
        }


        $verifica_data = explode('/', $data);
        $verifica_hora = explode(' ', $data);



        //tem data com hora
        if (next($verifica_hora) != '') {
            $tem_hora = $verifica_hora[1];
        } else {
            $tem_hora = '';
        }

        //� data padrao br
        if (next($verifica_data) != '') {
            $data = substr($verifica_data[2], 0, 4) . '-' . $verifica_data[1] . '-' . $verifica_data[0];
            $data = $data . ' ' . $tem_hora;
        } else {
            $data = $data;
        }


        $somenteData = date("Y-m-d", strtotime($data));
        $hoje = date("Y-m-d");
        $ontem = date("Y-m-d", strtotime("-1 day", strtotime($hoje)));
        $anteOntem = date("Y-m-d", strtotime("-2 day", strtotime($hoje)));
        $amanha = date("Y-m-d", strtotime("+1 day", strtotime($hoje)));
        $depoisAmanha = date("Y-m-d", strtotime("+2 day", strtotime($hoje)));

        $retorno = "";

        if ($hoje == $somenteData) {
            $retorno = "<b style='color: #016d96 !important;font-weight:bold' class='me-1'>Hoje</b>";
        } else if ($ontem == $somenteData) {
            $retorno = "<b style='color: #e3b46f !important;font-weight:bold' class='me-1'>Ontem</b>";
        } else if ($anteOntem == $somenteData) {
            $retorno = "<b style='color: #d14ea3 !important;font-weight:bold' class='me-1'>Anteontem</b>";
        } else if ($amanha == $somenteData) {
            $retorno = "<b style='color: #4ed17c !important;font-weight:bold' class='me-1'>Amanhã</b>";
        } else if ($depoisAmanha == $somenteData) {
            $retorno = "<b style='color: #93d14e !important;font-weight:bold' class='me-1'>Depois de amanhã</b>";
        } else {
            return Helpers::data_br($data);
        }

        return $retorno . ($tem_hora != '' ? ' ás ' . date('H:i', strtotime($data)) : '');
    }

    public static function obter_data_hora_amigavel_somente_texto($data)
    {
        $somenteData = date("Y-m-d", strtotime($data));
        $hoje = date("Y-m-d");
        $ontem = date("Y-m-d", strtotime("-1 day", strtotime($hoje)));
        $anteOntem = date("Y-m-d", strtotime("-2 day", strtotime($hoje)));
        $amanha = date("Y-m-d", strtotime("+1 day", strtotime($hoje)));
        $depoisAmanha = date("Y-m-d", strtotime("+2 day", strtotime($hoje)));

        $retorno = "";

        if ($hoje == $somenteData) {
            $retorno = "Hoje";
        } else if ($ontem == $somenteData) {
            $retorno = "Ontem";
        } else if ($anteOntem == $somenteData) {
            $retorno = "Anteontem";
        } else if ($amanha == $somenteData) {
            $retorno = "Amanhã";
        } else if ($depoisAmanha == $somenteData) {
            $retorno = "Depois de amanhã";
        } else {
            return Helpers::data_br($data);
        }

        return $retorno . ' ás ' . date('H:i', strtotime($data));
    }

    #Token
    public static function gerar_token($tamanho, $maiusculas, $minusculas, $numeros, $simbolos)
    {
        $ma = "ABCDEFGHIJKLMNOPQRSTUVYXWZ"; // $ma contem as letras maiúsculas
        $mi = "abcdefghijklmnopqrstuvyxwz"; // $mi contem as letras minusculas
        $nu = "0123456789"; // $nu contem os números
        $si = "!@#$%¨&*()_+="; // $si contem os símbolos
        $token = '';
        if ($maiusculas) {
            // se $maiusculas for "true", a variável $ma é embaralhada e adicionada para a variável $token
            $token .= str_shuffle($ma);
        }
        if ($minusculas) {
            // se $minusculas for "true", a variável $mi é embaralhada e adicionada para a variável $token
            $token .= str_shuffle($mi);
        }
        if ($numeros) {
            // se $numeros for "true", a variável $nu é embaralhada e adicionada para a variável $token
            $token .= str_shuffle($nu);
        }
        if ($simbolos) {
            // se $simbolos for "true", a variável $si é embaralhada e adicionada para a variável $token
            $token .= str_shuffle($si);
        }
        // retorna a token embaralhada com "str_shuffle" com o tamanho definido pela variável $tamanho
        return substr(str_shuffle($token), 0, $tamanho);
    }

    public static function back(array $flash = [])
    {
        $url = $_SERVER['HTTP_REFERER'] ?? '/';
        self::redirect($url, $flash);
    }

    public static function formatarCelular($telefone)
    {
        // Remove tudo que não for número
        $telefone = preg_replace('/\D/', '', $telefone);

        // Garante pelo menos 10 dígitos
        if (strlen($telefone) < 10) {
            return $telefone; // ou return null;
        }

        // DDD + número (8 ou 9 dígitos)
        return preg_replace(
            '/^(\d{2})(\d{4,5})(\d{4})$/',
            '($1) $2-$3',
            $telefone
        );
    }

    public static function redirect(string $url, array $flash = [])
    {
        if (!headers_sent()) {
            if (!empty($flash)) {
                $query = http_build_query($flash);
                $url .= (strpos($url, '?') === false ? '?' : '&') . $query;
            }
            header("Location: $url");
            exit;
        } else {
            echo "<script>window.location.href='$url';</script>";
            exit;
        }
    }
}
