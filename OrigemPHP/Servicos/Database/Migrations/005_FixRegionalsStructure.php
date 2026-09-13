<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE regionals
        DROP CONSTRAINT IF EXISTS fk_regionals_owner
    ");

    DB::statement("
        DROP INDEX IF EXISTS idx_regionals_owner_id
    ");

    DB::statement("
        DROP INDEX IF EXISTS uq_regionals_owner_name
    ");

    DB::statement("
        ALTER TABLE regionals
        DROP COLUMN IF EXISTS owner_id
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_regionals_name
        ON regionals (name)
    ");

    $regionals = [
        ['N', 'NORTE'],
        ['NE', 'NORDESTE'],
        ['CO', 'CENTRO-OESTE'],
        ['SE', 'SUDESTE'],
        ['S', 'SUL'],
    ];

    foreach ($regionals as [$abbreviation, $name]) {

        $exists = DB::table('regionals')
            ->where('name', $name)
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