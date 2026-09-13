<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $roles = DB::table('roles')
        ->pluck('id', 'slug')
        ->toArray();

    $permissions = DB::table('permissions')
        ->pluck('id', 'slug')
        ->toArray();

    $map = [

        'administrador' => [
            'owners.view',
            'owners.manage',
            'regionals.view',
            'regionals.manage',
            'installations.view',
            'installations.manage',
            'transmission_functions.view',
            'transmission_functions.manage',
            'ieds.view',
            'ieds.manage',
            'telemetry.view',
            'events.view',
            'comtrade.view',
            'comtrade.download',
            'oscillography.view',
            'users.view',
            'users.manage',
            'audit.view',
        ],

        'engenharia' => [
            'owners.view',
            'regionals.view',
            'installations.view',
            'transmission_functions.view',
            'transmission_functions.manage',
            'ieds.view',
            'ieds.manage',
            'telemetry.view',
            'events.view',
            'comtrade.view',
            'comtrade.download',
            'oscillography.view',
        ],

        'operador' => [
            'owners.view',
            'regionals.view',
            'installations.view',
            'transmission_functions.view',
            'ieds.view',
            'telemetry.view',
            'events.view',
            'comtrade.view',
            'oscillography.view',
        ],

        'consulta' => [
            'owners.view',
            'regionals.view',
            'installations.view',
            'transmission_functions.view',
            'ieds.view',
            'telemetry.view',
            'events.view',
            'comtrade.view',
            'oscillography.view',
        ],

    ];

    foreach ($map as $roleSlug => $permissionSlugs) {

        if (!isset($roles[$roleSlug])) {
            throw new RuntimeException(
                "Role não encontrada: {$roleSlug}"
            );
        }

        foreach ($permissionSlugs as $permissionSlug) {

            if (!isset($permissions[$permissionSlug])) {
                throw new RuntimeException(
                    "Permissão não encontrada: {$permissionSlug}"
                );
            }

            DB::table('role_permissions')->insert([
                'role_id' => $roles[$roleSlug],
                'permission_id' => $permissions[$permissionSlug],
            ]);
        }
    }
};