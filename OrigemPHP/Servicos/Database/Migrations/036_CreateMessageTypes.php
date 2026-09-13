<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE IF NOT EXISTS message_types (
            id BIGSERIAL PRIMARY KEY,
            code VARCHAR(150) NOT NULL,
            name VARCHAR(255) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    ");

    DB::statement("
        CREATE UNIQUE INDEX IF NOT EXISTS uq_message_types_code
        ON message_types (code)
    ");

    $permissions = [
        [
            'name' => 'Visualizar Tipos de Mensagens',
            'slug' => 'message_types.view',
            'description' => 'Permite visualizar tipos de mensagens.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Tipos de Mensagens',
            'slug' => 'message_types.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar tipos de mensagens.',
            'enabled' => true,
        ],
    ];

    foreach ($permissions as $permissionData) {
        if (!DB::table('permissions')->where('slug', $permissionData['slug'])->exists())
            DB::table('permissions')->insert($permissionData);
    }

    $rolePermissions = [
        'administrador' => ['message_types.view', 'message_types.manage'],
        'engenharia' => ['message_types.view', 'message_types.manage'],
        'operador' => ['message_types.view'],
        'consulta' => ['message_types.view'],
    ];

    foreach ($rolePermissions as $roleSlug => $permissionSlugs) {
        $role = DB::table('roles')->where('slug', $roleSlug)->first();
        if (!$role)
            throw new RuntimeException("Role não encontrada: {$roleSlug}");

        foreach ($permissionSlugs as $permissionSlug) {
            $permission = DB::table('permissions')->where('slug', $permissionSlug)->first();
            if (!$permission)
                throw new RuntimeException("Permissão não encontrada após criação: {$permissionSlug}");

            $exists = DB::table('role_permissions')
                ->where('role_id', $role->id)
                ->where('permission_id', $permission->id)
                ->exists();

            if (!$exists)
                DB::table('role_permissions')->insert([
                    'role_id' => $role->id,
                    'permission_id' => $permission->id,
                ]);
        }
    }
};
