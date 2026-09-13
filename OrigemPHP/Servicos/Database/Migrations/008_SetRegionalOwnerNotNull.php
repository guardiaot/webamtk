<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE regionals
        ALTER COLUMN owner_id SET NOT NULL
    ");
};