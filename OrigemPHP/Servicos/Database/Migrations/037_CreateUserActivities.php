<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS user_activities (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NULL,
            action VARCHAR(100) NOT NULL,
            module VARCHAR(100) NOT NULL,
            entity_type VARCHAR(100) NULL,
            entity_id VARCHAR(255) NULL,
            description TEXT NOT NULL,
            http_method VARCHAR(10) NULL,
            route VARCHAR(500) NULL,
            ip_address VARCHAR(64) NULL,
            user_agent TEXT NULL,
            metadata JSONB NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT fk_user_activities_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    ");

    DB::statement("CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities (user_id)");
    DB::statement("CREATE INDEX IF NOT EXISTS idx_user_activities_action ON user_activities (action)");
    DB::statement("CREATE INDEX IF NOT EXISTS idx_user_activities_module ON user_activities (module)");
    DB::statement("CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities (created_at)");
};
