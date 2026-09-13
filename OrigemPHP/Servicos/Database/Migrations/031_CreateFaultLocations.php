<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS fault_locations (
            id BIGSERIAL PRIMARY KEY,
            comtrade_record_id BIGINT NOT NULL,
            transmission_function_id BIGINT NULL,
            fault_distance_km NUMERIC(18, 8) NULL,
            fault_distance_percent NUMERIC(10, 6) NULL,
            fault_type VARCHAR(50) NULL,
            algorithm VARCHAR(100) NULL,
            is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
            status VARCHAR(30) NOT NULL DEFAULT 'pending',
            error_message TEXT NULL,
            calculated_at TIMESTAMPTZ NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_fault_locations_comtrade_record
                FOREIGN KEY (comtrade_record_id)
                REFERENCES comtrade_records(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_fault_locations_function
                FOREIGN KEY (transmission_function_id)
                REFERENCES transmission_functions(id)
                ON DELETE SET NULL
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_fault_locations_comtrade_record_id
        ON fault_locations (comtrade_record_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_fault_locations_function_id
        ON fault_locations (transmission_function_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_fault_locations_status
        ON fault_locations (status)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_fault_locations_calculated_at
        ON fault_locations (calculated_at)
    ");
};
