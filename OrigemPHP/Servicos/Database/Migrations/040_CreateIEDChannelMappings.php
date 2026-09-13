<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS ied_channel_mapping_profiles (
            id BIGSERIAL PRIMARY KEY,
            ied_id BIGINT NOT NULL,
            layout_fingerprint VARCHAR(64) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'draft',
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_ied_channel_mapping_profiles_ied
                FOREIGN KEY (ied_id)
                REFERENCES ieds(id)
                ON DELETE RESTRICT,

            CONSTRAINT chk_ied_channel_mapping_profiles_status
                CHECK (status IN ('draft', 'confirmed', 'invalidated')),

            CONSTRAINT chk_ied_channel_mapping_profiles_version
                CHECK (version >= 1)
        )
    ");

    DB::statement("CREATE INDEX IF NOT EXISTS idx_ied_channel_mapping_profiles_ied_id ON ied_channel_mapping_profiles (ied_id)");

    DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_channel_mapping_profiles_confirmed ON ied_channel_mapping_profiles (ied_id, layout_fingerprint) WHERE status = 'confirmed'");

    DB::statement("
        CREATE TABLE IF NOT EXISTS ied_channel_mappings (
            id BIGSERIAL PRIMARY KEY,
            profile_id BIGINT NOT NULL,
            channel_kind VARCHAR(10) NOT NULL,
            channel_number INTEGER NOT NULL,
            channel_name VARCHAR(255) NULL,
            channel_phase VARCHAR(20) NULL,
            channel_circuit VARCHAR(255) NULL,
            channel_unit VARCHAR(50) NULL,
            channel_a DOUBLE PRECISION NULL,
            channel_b DOUBLE PRECISION NULL,
            channel_primary DOUBLE PRECISION NULL,
            channel_secondary DOUBLE PRECISION NULL,
            channel_ps VARCHAR(10) NULL,
            semantic_code VARCHAR(50) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_ied_channel_mappings_profile
                FOREIGN KEY (profile_id)
                REFERENCES ied_channel_mapping_profiles(id)
                ON DELETE CASCADE,

            CONSTRAINT chk_ied_channel_mappings_channel_kind
                CHECK (channel_kind IN ('analog', 'digital')),

            CONSTRAINT chk_ied_channel_mappings_channel_number
                CHECK (channel_number > 0)
        )
    ");

    DB::statement("CREATE INDEX IF NOT EXISTS idx_ied_channel_mappings_profile_id ON ied_channel_mappings (profile_id)");

    DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_channel_mappings_channel ON ied_channel_mappings (profile_id, channel_kind, channel_number)");

    DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_channel_mappings_semantic_active ON ied_channel_mappings (profile_id, semantic_code) WHERE enabled = TRUE");
};
