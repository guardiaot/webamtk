<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $permissionSlug = 'monitoring.view';
    $permission = DB::table('permissions')
        ->where('slug', $permissionSlug)
        ->first();

    if (!$permission) {
        DB::table('permissions')->insert([
            'name' => 'Visualizar Monitoramento',
            'slug' => $permissionSlug,
            'description' => 'Permite visualizar o monitoramento operacional de Agents e IEDs.',
            'enabled' => true,
        ]);

        $permission = DB::table('permissions')
            ->where('slug', $permissionSlug)
            ->first();
    }

    if (!$permission) {
        throw new RuntimeException(
            "Permissão não encontrada após criação: {$permissionSlug}"
        );
    }

    $roleSlugs = [
        'administrador',
        'engenharia',
        'operador',
        'consulta',
    ];

    foreach ($roleSlugs as $roleSlug) {
        $role = DB::table('roles')
            ->where('slug', $roleSlug)
            ->first();

        if (!$role) {
            throw new RuntimeException(
                "Role não encontrada: {$roleSlug}"
            );
        }

        $exists = DB::table('role_permissions')
            ->where('role_id', $role->id)
            ->where('permission_id', $permission->id)
            ->exists();

        if (!$exists) {
            DB::table('role_permissions')->insert([
                'role_id' => $role->id,
                'permission_id' => $permission->id,
            ]);
        }
    }
};
