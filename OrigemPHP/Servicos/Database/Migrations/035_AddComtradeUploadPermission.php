<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $permissionSlug = 'comtrade.upload';
    $permission = DB::table('permissions')
        ->where('slug', $permissionSlug)
        ->first();

    if (!$permission) {
        DB::table('permissions')->insert([
            'name' => 'Importar arquivos COMTRADE',
            'slug' => $permissionSlug,
            'description' => 'Permite importar manualmente arquivos COMTRADE CFG e DAT.',
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
