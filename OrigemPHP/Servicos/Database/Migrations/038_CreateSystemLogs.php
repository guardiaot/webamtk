<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("\n        CREATE TABLE IF NOT EXISTS system_logs (\n            id BIGSERIAL PRIMARY KEY,\n            level VARCHAR(20) NOT NULL,\n            module VARCHAR(100) NOT NULL,\n            message TEXT NOT NULL,\n            route VARCHAR(500) NULL,\n            context JSONB NULL,\n            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n        )\n    ");

    DB::statement("CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs (created_at)");
    DB::statement("CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs (level)");
    DB::statement("CREATE INDEX IF NOT EXISTS idx_system_logs_module ON system_logs (module)");
};
