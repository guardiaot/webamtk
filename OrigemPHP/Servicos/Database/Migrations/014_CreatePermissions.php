<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE permissions (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(150) NOT NULL,
            description VARCHAR(255) NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX uq_permissions_slug
        ON permissions (slug)
    ");

    DB::statement("
        CREATE INDEX idx_permissions_enabled
        ON permissions (enabled)
    ");
};