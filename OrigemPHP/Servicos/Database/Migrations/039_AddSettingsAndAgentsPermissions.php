<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $permissionDefinitions = [
        'settings.view' => [
            'name' => 'Visualizar configurações do sistema',
            'description' => 'Permite visualizar as configurações do sistema.',
        ],
        'settings.manage' => [
            'name' => 'Gerenciar configurações do sistema',
            'description' => 'Permite alterar as configurações do sistema.',
        ],
        'agents.view' => [
            'name' => 'Visualizar Agents',
            'description' => 'Permite visualizar Agents cadastrados.',
        ],
        'agents.manage' => [
            'name' => 'Gerenciar Agents',
            'description' => 'Permite cadastrar, editar e excluir Agents.',
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
            'settings.view',
            'settings.manage',
            'agents.view',
            'agents.manage',
        ],
        'engenharia' => [
            'agents.view',
            'agents.manage',
        ],
        'operador' => [
            'agents.view',
        ],
        'consulta' => [
            'agents.view',
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
