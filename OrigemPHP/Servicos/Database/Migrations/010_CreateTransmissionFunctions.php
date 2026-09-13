<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS transmission_functions (
            id BIGSERIAL PRIMARY KEY,
            installation_id BIGINT NOT NULL,
            type_id BIGINT NOT NULL,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_transmission_functions_installation
                FOREIGN KEY (installation_id)
                REFERENCES installations(id)
                ON DELETE RESTRICT,

            CONSTRAINT fk_transmission_functions_type
                FOREIGN KEY (type_id)
                REFERENCES transmission_function_types(id)
                ON DELETE RESTRICT
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_transmission_functions_installation_name
        ON transmission_functions (installation_id, name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_transmission_functions_installation_id
        ON transmission_functions (installation_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_transmission_functions_type_id
        ON transmission_functions (type_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_transmission_functions_enabled
        ON transmission_functions (enabled)
    ");
};