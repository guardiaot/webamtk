<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS collection_drivers (
            id BIGSERIAL PRIMARY KEY,
            code VARCHAR(100) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_collection_drivers_code
        ON collection_drivers (code)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_collection_drivers_enabled
        ON collection_drivers (enabled)
    ");
};
