<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            last_login_at TIMESTAMPTZ NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX uq_users_email
        ON users (email)
    ");

    DB::statement("
        CREATE INDEX idx_users_enabled
        ON users (enabled)
    ");
};