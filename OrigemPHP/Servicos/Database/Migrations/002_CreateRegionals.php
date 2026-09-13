<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS regionals (
            id BIGSERIAL PRIMARY KEY,
            abbreviation VARCHAR(2) NOT NULL,
            name VARCHAR(100) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_regionals_abbreviation
        ON regionals (abbreviation)
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_regionals_name
        ON regionals (name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_regionals_enabled
        ON regionals (enabled)
    ");

    $regionals = [
        ['AC', 'ACRE'],
        ['AL', 'ALAGOAS'],
        ['AP', 'AMAPA'],
        ['AM', 'AMAZONAS'],
        ['BA', 'BAHIA'],
        ['CE', 'CEARA'],
        ['DF', 'DISTRITO FEDERAL'],
        ['ES', 'ESPIRITO SANTO'],
        ['RR', 'RORAIMA'],
        ['GO', 'GOIAS'],
        ['MA', 'MARANHAO'],
        ['MT', 'MATO GROSSO'],
        ['MS', 'MATO GROSSO DO SUL'],
        ['MG', 'MINAS GERAIS'],
        ['PA', 'PARA'],
        ['PB', 'PARAIBA'],
        ['PR', 'PARANA'],
        ['PE', 'PERNAMBUCO'],
        ['PI', 'PIAUI'],
        ['RJ', 'RIO DE JANEIRO'],
        ['RN', 'RIO GRANDE DO NORTE'],
        ['RS', 'RIO GRANDE DO SUL'],
        ['RO', 'RONDONIA'],
        ['TO', 'TOCANTINS'],
        ['SC', 'SANTA CATARINA'],
        ['SP', 'SAO PAULO'],
        ['SE', 'SERGIPE'],
    ];

    foreach ($regionals as [$abbreviation, $name]) {

        $exists = DB::table('regionals')
            ->where('abbreviation', $abbreviation)
            ->exists();

        if (!$exists) {
            DB::table('regionals')->insert([
                'abbreviation' => $abbreviation,
                'name' => $name,
                'enabled' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }
};