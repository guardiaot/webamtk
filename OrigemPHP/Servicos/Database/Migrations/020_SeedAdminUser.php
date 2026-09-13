<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    // Evita inserir duas vezes
    $exists = DB::table('users')
        ->where('email', 'jagodinho@comunicabr.com.br')
        ->exists();

    if ($exists) {
        return;
    }

    $userId = DB::table('users')->insertGetId([
        'name' => 'Jorge A Godinho',
        'email' => 'jagodinho@comunicabr.com.br',
        'password' => '$2y$10$Fx1.i9/F.5hyXsuOLW6VOurtx87hlWlL1EzyEXJWks3R8rpw3mZCe',
        'enabled' => true,
    ]);

    $adminRoleId = DB::table('roles')
        ->where('slug', 'administrador')
        ->value('id');

    DB::table('user_roles')->insert([
        'user_id' => $userId,
        'role_id' => $adminRoleId,
    ]);
};