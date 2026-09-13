<?php

/**
 * ============================================================
 * SCRIPT DE CRIAÇÃO DE TABELAS - AMTK
 * ============================================================
 *
 * Execute este arquivo uma única vez para criar as tabelas
 * necessárias para o funcionamento do frontend.
 *
 * Uso:
 *   php OrigemPHP/Servicos/Database/CreateTables.php
 *
 * Ou acesse via browser:
 *   http://amtk.test/criar-tabelas
 */

require_once __DIR__ . '/../../../vendor/autoload.php';

use OrigemPHP\Config\Connection;
use Illuminate\Database\Capsule\Manager as DB;

/*
 * Inicializa conexão
 */
new Connection();

echo "=== AMTK - Criação de Tabelas ===\n\n";

/*
 * ============================================================
 * TABELA: comtrade_records
 * ============================================================
 */
echo "Criando tabela comtrade_records...\n";

DB::statement("
    CREATE TABLE IF NOT EXISTS comtrade_records (
        id VARCHAR(255) PRIMARY KEY,
        ied_id VARCHAR(255),
        agent_id VARCHAR(255),
        station_name VARCHAR(255),
        device_id VARCHAR(255),
        trigger_reason VARCHAR(255),
        nominal_frequency DOUBLE PRECISION,
        sample_rate INTEGER,
        total_samples INTEGER,
        analog_channels INTEGER,
        digital_channels INTEGER,
        duration DOUBLE PRECISION,
        timestamp TIMESTAMP,
        file_cfg VARCHAR(255),
        file_dat VARCHAR(255),
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
");

echo "✓ comtrade_records criada com sucesso\n\n";

/*
 * ============================================================
 * TABELA: system_settings
 * ============================================================
 */
echo "Criando tabela system_settings...\n";

DB::statement("
    CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
");

echo "✓ system_settings criada com sucesso\n\n";

/*
 * ============================================================
 * ÍNDICES
 * ============================================================
 */
echo "Criando índices...\n";

DB::statement("
    CREATE INDEX IF NOT EXISTS idx_comtrade_records_ied_id
    ON comtrade_records(ied_id)
");

DB::statement("
    CREATE INDEX IF NOT EXISTS idx_comtrade_records_timestamp
    ON comtrade_records(timestamp)
");

DB::statement("
    CREATE INDEX IF NOT EXISTS idx_comtrade_records_status
    ON comtrade_records(status)
");

DB::statement("
    CREATE INDEX IF NOT EXISTS idx_system_settings_key
    ON system_settings(key)
");

echo "✓ Índices criados com sucesso\n\n";

/*
 * ============================================================
 * DADOS INICIAIS (system_settings)
 * ============================================================
 */
echo "Inserindo configurações padrão...\n";

$defaultSettings = [
    'systemName' => 'AMTK Monitoring',
    'description' => 'Sistema de monitoramento de subestações',
    'collectionInterval' => '5',
    'connectionTimeout' => '5',
    'retryAttempts' => '3',
    'telemetryInterval' => '5',
    'telemetryRetention' => '90',
    'eventRetention' => '180',
    'agentTimeout' => '10',
    'apiTimeout' => '10',
    'timezone' => 'America/Sao_Paulo',
    'language' => 'pt-BR',
    'sessionTimeout' => '60',
    'maintenanceMode' => 'false'
];

foreach ($defaultSettings as $key => $value) {
    $exists = DB::table('system_settings')
        ->where('key', $key)
        ->first();

    if (!$exists) {
        DB::table('system_settings')->insert([
            'key' => $key,
            'value' => $value,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
}

echo "✓ Configurações padrão inseridas\n\n";

echo "=== Migração concluída com sucesso! ===\n";
