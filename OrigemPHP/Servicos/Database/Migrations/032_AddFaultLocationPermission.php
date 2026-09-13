<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $permissionSlug = 'fault_locations.view';
    $permission = DB::table('permissions')
        ->where('slug', $permissionSlug)
        ->first();

    if (!$permission) {
        DB::table('permissions')->insert([
            'name' => 'Visualizar Localização da Falta',
            'slug' => $permissionSlug,
            'description' => 'Permite visualizar resultados de localização da falta.',
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

        $associationExists = DB::table('role_permissions')
            ->where('role_id', $role->id)
            ->where('permission_id', $permission->id)
            ->exists();

        if (!$associationExists) {
            DB::table('role_permissions')->insert([
                'role_id' => $role->id,
                'permission_id' => $permission->id,
            ]);
        }
    }
};
