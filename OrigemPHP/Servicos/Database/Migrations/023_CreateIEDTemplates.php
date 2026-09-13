<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS ied_templates (
            id BIGSERIAL PRIMARY KEY,
            ied_type_id BIGINT NOT NULL,
            manufacturer VARCHAR(255) NOT NULL,
            model VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_ied_templates_ied_type
                FOREIGN KEY (ied_type_id)
                REFERENCES ied_types(id)
                ON DELETE RESTRICT
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_templates_name
        ON ied_templates (name)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ied_templates_ied_type_id
        ON ied_templates (ied_type_id)
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ied_templates_enabled
        ON ied_templates (enabled)
    ");
};
