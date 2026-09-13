<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE ieds
        ADD COLUMN driver_override_id BIGINT NULL
    ");

    DB::statement("
        ALTER TABLE ieds
        ADD CONSTRAINT fk_ieds_driver_override
        FOREIGN KEY (driver_override_id)
        REFERENCES collection_drivers(id)
        ON DELETE RESTRICT
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ieds_driver_override_id
        ON ieds (driver_override_id)
    ");
};
