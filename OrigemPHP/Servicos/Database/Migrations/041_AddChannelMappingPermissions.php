<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $permissionDefinitions = [
        'channel_mappings.view' => [
            'name' => 'Visualizar Associação de Canais',
            'description' => 'Permite visualizar associações de canais COMTRADE.',
        ],
        'channel_mappings.manage' => [
            'name' => 'Gerenciar Associação de Canais',
            'description' => 'Permite criar, editar e confirmar associações de canais COMTRADE.',
        ],
    ];

    $permissions = [];

    foreach ($permissionDefinitions as $slug => $definition) {
        $permission = DB::table('permissions')
            ->where('slug', $slug)
            ->first();

        if (!$permission) {
            DB::table('permissions')->insert([
                'name' => $definition['name'],
                'slug' => $slug,
                'description' => $definition['description'],
                'enabled' => true,
            ]);

            $permission = DB::table('permissions')
                ->where('slug', $slug)
                ->first();
        }

        if (!$permission) {
            throw new RuntimeException(
                "Permissão não encontrada após criação: {$slug}"
            );
        }

        $permissions[$slug] = $permission;
    }

    $rolePermissions = [
        'administrador' => [
            'channel_mappings.view',
            'channel_mappings.manage',
        ],
        'engenharia' => [
            'channel_mappings.view',
            'channel_mappings.manage',
        ],
    ];

    foreach ($rolePermissions as $roleSlug => $permissionSlugs) {
        $role = DB::table('roles')
            ->where('slug', $roleSlug)
            ->first();

        if (!$role) {
            throw new RuntimeException(
                "Role não encontrada: {$roleSlug}"
            );
        }

        foreach ($permissionSlugs as $permissionSlug) {
            $associationExists = DB::table('role_permissions')
                ->where('role_id', $role->id)
                ->where('permission_id', $permissions[$permissionSlug]->id)
                ->exists();

            if (!$associationExists) {
                DB::table('role_permissions')->insert([
                    'role_id' => $role->id,
                    'permission_id' => $permissions[$permissionSlug]->id,
                ]);
            }
        }
    }
};
