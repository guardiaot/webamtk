<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE ieds
        ADD COLUMN ied_template_id BIGINT NULL
    ");

    DB::statement("
        ALTER TABLE ieds
        ADD CONSTRAINT fk_ieds_ied_template
        FOREIGN KEY (ied_template_id)
        REFERENCES ied_templates(id)
        ON DELETE RESTRICT
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_ieds_ied_template_id
        ON ieds (ied_template_id)
    ");
};
