<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS installations (
            id BIGSERIAL PRIMARY KEY,
            owner_id BIGINT NOT NULL,
            regional_id BIGINT NOT NULL,
            state_id BIGINT NOT NULL,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_installations_owner
                FOREIGN KEY (owner_id)
                REFERENCES owners(id)
                ON DELETE RESTRICT,

            CONSTRAINT fk_installations_regional
                FOREIGN KEY (regional_id)
                REFERENCES regionals(id)
                ON DELETE RESTRICT,

            CONSTRAINT fk_installations_state
                FOREIGN KEY (state_id)
                REFERENCES states(id)
                ON DELETE RESTRICT
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_installations_context_name
        ON installations (owner_id, regional_id, state_id, name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_installations_owner_id
        ON installations (owner_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_installations_regional_id
        ON installations (regional_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_installations_state_id
        ON installations (state_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_installations_enabled
        ON installations (enabled)
    ");
};