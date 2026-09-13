<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS transmission_function_types (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_transmission_function_types_name
        ON transmission_function_types (name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_transmission_function_types_enabled
        ON transmission_function_types (enabled)
    ");

    $types = [
        'LINHA DE TRANSMISSAO',
        'TRANSFORMADOR',
        'BANCO DE CAPACITORES',
    ];

    foreach ($types as $name) {

        $exists = DB::table('transmission_function_types')
            ->where('name', $name)
            ->exists();

        if (!$exists) {
            DB::table('transmission_function_types')->insert([
                'name' => $name,
                'enabled' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }
};