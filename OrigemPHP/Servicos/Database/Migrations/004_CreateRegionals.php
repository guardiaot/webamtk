<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS regionals (
            id BIGSERIAL PRIMARY KEY,
            owner_id BIGINT NOT NULL,
            name VARCHAR(255) NOT NULL,
            abbreviation VARCHAR(50),
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_regionals_owner
                FOREIGN KEY (owner_id)
                REFERENCES owners(id)
                ON DELETE RESTRICT
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_regionals_owner_name
        ON regionals (owner_id, name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_regionals_owner_id
        ON regionals (owner_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_regionals_enabled
        ON regionals (enabled)
    ");
};