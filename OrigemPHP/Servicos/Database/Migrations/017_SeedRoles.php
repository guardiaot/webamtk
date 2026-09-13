<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::table('roles')->insert([
        [
            'name' => 'Administrador',
            'slug' => 'administrador',
            'description' => 'Acesso administrativo completo ao sistema.',
            'enabled' => true,
        ],
        [
            'name' => 'Engenharia',
            'slug' => 'engenharia',
            'description' => 'Acesso aos recursos técnicos, IEDs, telemetria, eventos, COMTRADE e oscilografia.',
            'enabled' => true,
        ],
        [
            'name' => 'Operador',
            'slug' => 'operador',
            'description' => 'Acesso operacional e de consulta ao sistema.',
            'enabled' => true,
        ],
        [
            'name' => 'Consulta',
            'slug' => 'consulta',
            'description' => 'Acesso somente para visualização e consulta.',
            'enabled' => true,
        ],
    ]);
};