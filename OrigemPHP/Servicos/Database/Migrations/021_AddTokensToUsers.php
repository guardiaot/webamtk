<?php

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Schema\Blueprint;

return function () {
    $schema = DB::schema();

    if (!$schema->hasColumn('users', 'access_token')) {
        $schema->table('users', function (Blueprint $table) {
            $table->string('access_token', 512)
                ->nullable();
        });
    }

    if (!$schema->hasColumn('users', 'remember_me_token')) {
        $schema->table('users', function (Blueprint $table) {
            $table->string('remember_me_token', 255)
                ->nullable();
        });
    }
};