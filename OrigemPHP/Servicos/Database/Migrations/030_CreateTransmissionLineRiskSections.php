<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS transmission_line_risk_sections (
            id BIGSERIAL PRIMARY KEY,
            transmission_function_id BIGINT NOT NULL,
            km_start NUMERIC(18, 8) NOT NULL,
            km_end NUMERIC(18, 8) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_transmission_line_risk_sections_function
                FOREIGN KEY (transmission_function_id)
                REFERENCES transmission_functions(id)
                ON DELETE CASCADE
        )
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_transmission_line_risk_sections_function_id
        ON transmission_line_risk_sections (transmission_function_id)
    ");
};
