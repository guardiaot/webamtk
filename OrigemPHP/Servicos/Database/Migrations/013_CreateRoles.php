<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE roles (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(100) NOT NULL,
            description VARCHAR(255) NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX uq_roles_name
        ON roles (name)
    ");

    DB::statement("
        CREATE UNIQUE INDEX uq_roles_slug
        ON roles (slug)
    ");

    DB::statement("
        CREATE INDEX idx_roles_enabled
        ON roles (enabled)
    ");
};