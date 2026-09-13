<?php

namespace OrigemPHP\Servicos\Settings;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class SettingsApi extends BaseController
{
    /**
     * ============================================================
     * CARREGAR CONFIGURAÇÕES
     * ============================================================
     *
     * Busca as configurações da tabela system_settings.
     * Se a tabela não existir ou estiver vazia, retorna
     * os valores padrão.
     */
    public static function carregar($request)
    {
        Permissao::proteger('settings.view');
        $defaults = self::getDefaults();

        try {
            $rows = DB::table('system_settings')
                ->select('key', 'value')
                ->get();

            $settings = $defaults;

            foreach ($rows as $row) {
                $settings[$row->key] = $row->value;

                if ($row->key === 'maintenanceMode') {
                    $settings[$row->key] = self::booleanValue($row->value);
                }
            }

            return [
                'erro' => 0,
                'data' => $settings
            ];
        } catch (\Exception $e) {
            /*
             * Se a tabela não existir, retorna defaults
             */
            return [
                'erro' => 0,
                'data' => $defaults
            ];
        }
    }

    /**
     * ============================================================
     * SALVAR CONFIGURAÇÕES
     * ============================================================
     */
    public static function salvar($request)
    {
        Permissao::proteger('settings.manage');
        $dados = $request->getPostVars();

        if (empty($dados)) {
            return [
                'erro' => 1,
                'mensagem' => 'Nenhuma configuração informada.'
            ];
        }

        $allowed = [
            'systemName',
            'description',
            'collectionInterval',
            'connectionTimeout',
            'retryAttempts',
            'telemetryInterval',
            'telemetryRetention',
            'eventRetention',
            'agentTimeout',
            'apiTimeout',
            'timezone',
            'language',
            'sessionTimeout',
            'maintenanceMode'
        ];

        if (array_diff(array_keys($dados), $allowed)) {
            return [
                'erro' => 1,
                'mensagem' => 'Existem configuracoes nao permitidas.'
            ];
        }

        $textFields = [
            'systemName',
            'description',
            'timezone',
            'language'
        ];

        foreach ($textFields as $key) {
            if (array_key_exists($key, $dados) && !is_string($dados[$key])) {
                return [
                    'erro' => 1,
                    'mensagem' => "A configuracao {$key} deve ser texto."
                ];
            }
        }

        $numericFields = [
            'collectionInterval',
            'connectionTimeout',
            'retryAttempts',
            'telemetryInterval',
            'telemetryRetention',
            'eventRetention',
            'agentTimeout',
            'apiTimeout',
            'sessionTimeout'
        ];

        foreach ($numericFields as $key) {
            if (!array_key_exists($key, $dados)) {
                continue;
            }

            $value = $dados[$key];
            $valid = is_int($value) && $value >= 0;

            if (is_string($value) && ctype_digit($value)) {
                $valid = true;
            }

            if (!$valid) {
                return [
                    'erro' => 1,
                    'mensagem' => "A configuracao {$key} deve ser um numero inteiro nao negativo."
                ];
            }

            $dados[$key] = (int) $value;
        }

        if (array_key_exists('maintenanceMode', $dados)) {
            $maintenanceMode = self::booleanValue($dados['maintenanceMode'], null);

            if ($maintenanceMode === null) {
                return [
                    'erro' => 1,
                    'mensagem' => 'A configuracao maintenanceMode deve ser true ou false.'
                ];
            }

            $dados['maintenanceMode'] = $maintenanceMode;
        }

        try {
            foreach ($dados as $key => $value) {
                $exists = DB::table('system_settings')
                    ->where('key', $key)
                    ->first();

                if ($exists) {
                    DB::table('system_settings')
                        ->where('key', $key)
                        ->update([
                            'value' => is_string($value) ? $value : json_encode($value),
                            'updated_at' => date('Y-m-d H:i:s')
                        ]);
                } else {
                    DB::table('system_settings')->insert([
                        'key' => $key,
                        'value' => is_string($value) ? $value : json_encode($value),
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]);
                }
            }

            return [
                'erro' => 0,
                'mensagem' => 'Configurações salvas com sucesso.'
            ];
        } catch (\Exception $e) {
            return [
                'erro' => 1,
                'mensagem' => 'Erro ao salvar configurações: ' . $e->getMessage()
            ];
        }
    }

    /**
     * ============================================================
     * VALORES PADRÃO
     * ============================================================
     */
    private static function getDefaults()
    {
        return [
            'systemName' => 'AMTK Monitoring',
            'description' => 'Sistema de monitoramento de subestações',
            'collectionInterval' => 5,
            'connectionTimeout' => 5,
            'retryAttempts' => 3,
            'telemetryInterval' => 5,
            'telemetryRetention' => 90,
            'eventRetention' => 180,
            'agentTimeout' => 10,
            'apiTimeout' => 10,
            'timezone' => 'America/Sao_Paulo',
            'language' => 'pt-BR',
            'sessionTimeout' => 60,
            'maintenanceMode' => false
        ];
    }

    private static function booleanValue($value, $default = false)
    {
        if (is_bool($value)) {
            return $value;
        }

        if ($value === 'true' || $value === '1' || $value === 1) {
            return true;
        }

        if ($value === 'false' || $value === '0' || $value === 0) {
            return false;
        }

        return $default;
    }
}
