<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE ieds
        ADD COLUMN transmission_function_id BIGINT
    ");

    DB::statement("
        ALTER TABLE ieds
        ADD CONSTRAINT fk_ieds_transmission_function
        FOREIGN KEY (transmission_function_id)
        REFERENCES transmission_functions(id)
        ON DELETE SET NULL
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ieds_transmission_function_id
        ON ieds (transmission_function_id)
    ");
};