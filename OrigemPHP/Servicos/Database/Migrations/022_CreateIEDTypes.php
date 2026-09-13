<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS ied_types (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_types_name
        ON ied_types (name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ied_types_enabled
        ON ied_types (enabled)
    ");
};
