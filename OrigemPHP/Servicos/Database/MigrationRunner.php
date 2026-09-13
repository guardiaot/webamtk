<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

use OrigemPHP\Config\Connection;
use Illuminate\Database\Capsule\Manager as DB;

/*
 * Define o DOCUMENT_ROOT para reutilizar a conexão
 * existente do OrigemPHP em execução via CLI.
 */
$_SERVER['DOCUMENT_ROOT'] = realpath(__DIR__ . '/../../../public');

new Connection();

echo "=== AMTK Migration Runner ===\n\n";

/*
 * Tabela de controle das migrations executadas.
 */
DB::statement("
    CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        migration VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
");

$migrationsPath = __DIR__ . '/Migrations';

$files = glob($migrationsPath . '/*.php');

if (!$files) {
    echo "Nenhuma migration encontrada.\n";
    exit(0);
}

sort($files);

$executed = DB::table('schema_migrations')
    ->pluck('migration')
    ->toArray();

$executed = array_flip($executed);

$pending = 0;

foreach ($files as $file) {

    $migrationName = basename($file);

    if (isset($executed[$migrationName])) {
        echo "[SKIP] {$migrationName}\n";
        continue;
    }

    echo "[RUN ] {$migrationName}\n";

    $migration = require $file;

    if (!is_callable($migration)) {
        throw new RuntimeException(
            "Migration {$migrationName} deve retornar uma função executável."
        );
    }

    DB::connection()->transaction(function () use (
        $migration,
        $migrationName
    ) {
        $migration();

        DB::table('schema_migrations')->insert([
            'migration' => $migrationName,
            'executed_at' => date('Y-m-d H:i:s'),
        ]);
    });

    echo "[ OK ] {$migrationName}\n";

    $pending++;
}

echo "\n";

if ($pending === 0) {
    echo "Banco já está atualizado.\n";
} else {
    echo "{$pending} migration(s) executada(s) com sucesso.\n";
}

echo "\n=== Migração concluída ===\n";