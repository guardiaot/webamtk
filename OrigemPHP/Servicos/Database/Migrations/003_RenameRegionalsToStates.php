<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE regionals
        RENAME TO states
    ");

};