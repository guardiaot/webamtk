<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {
    DB::statement("
        CREATE TABLE IF NOT EXISTS owners (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            ons_name VARCHAR(255),
            ons_ftp_folder VARCHAR(255),
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_owners_name
        ON owners (name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_owners_enabled
        ON owners (enabled)
    ");
};