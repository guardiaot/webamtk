<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    /*
     * Remove as regionais geográficas criadas anteriormente.
     */
    DB::table('regionals')->delete();

    /*
     * Ajusta regionals para pertencer a um proprietário.
     */
    DB::statement("
        ALTER TABLE regionals
        ADD COLUMN owner_id BIGINT
    ");

    DB::statement("
        ALTER TABLE regionals
        ADD CONSTRAINT fk_regionals_owner
        FOREIGN KEY (owner_id)
        REFERENCES owners(id)
        ON DELETE RESTRICT
    ");

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_regionals_owner_id
        ON regionals (owner_id)
    ");

    /*
     * Uma mesma regional pode existir em proprietários diferentes,
     * então a unicidade deve considerar o proprietário.
     */
    DB::statement("
        DROP INDEX IF EXISTS uq_regionals_name
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_regionals_owner_name
        ON regionals (owner_id, name)
    ");

    /*
     * Ajusta installations:
     * proprietário passa a ser obtido via regional.
     */
    DB::statement("
        ALTER TABLE installations
        DROP CONSTRAINT IF EXISTS fk_installations_owner
    ");

    DB::statement("
        DROP INDEX IF EXISTS idx_installations_owner_id
    ");

    DB::statement("
        DROP INDEX IF EXISTS uq_installations_context_name
    ");

    DB::statement("
        ALTER TABLE installations
        DROP COLUMN IF EXISTS owner_id
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_installations_regional_state_name
        ON installations (regional_id, state_id, name)
    ");
};