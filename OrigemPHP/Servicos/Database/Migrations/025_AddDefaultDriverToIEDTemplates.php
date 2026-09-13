<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE ied_templates
        ADD COLUMN default_driver_id BIGINT NULL
    ");

    DB::statement("
        ALTER TABLE ied_templates
        ADD CONSTRAINT fk_ied_templates_default_driver
        FOREIGN KEY (default_driver_id)
        REFERENCES collection_drivers(id)
        ON DELETE RESTRICT
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ied_templates_default_driver_id
        ON ied_templates (default_driver_id)
    ");
};
