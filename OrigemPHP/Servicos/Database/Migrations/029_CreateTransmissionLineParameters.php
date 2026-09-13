<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS transmission_line_parameters (
            id BIGSERIAL PRIMARY KEY,
            transmission_function_id BIGINT NOT NULL,
            voltage_level NUMERIC(18, 8) NULL,
            nominal_current NUMERIC(18, 8) NULL,
            line_length_km NUMERIC(18, 8) NULL,
            infeed BOOLEAN NOT NULL DEFAULT FALSE,
            r1 NUMERIC(18, 8) NULL,
            r0 NUMERIC(18, 8) NULL,
            x1 NUMERIC(18, 8) NULL,
            x0 NUMERIC(18, 8) NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_transmission_line_parameters_function
                FOREIGN KEY (transmission_function_id)
                REFERENCES transmission_functions(id)
                ON DELETE CASCADE
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_transmission_line_parameters_function_id
        ON transmission_line_parameters (transmission_function_id)
    ");
};
