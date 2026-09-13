<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    $drivers = [
        [
            'code' => 'simulator',
            'name' => 'Simulador',
            'description' => 'Driver de coleta utilizado para simulação e homologação.',
            'enabled' => true,
        ],
        [
            'code' => 'iec61850',
            'name' => 'IEC 61850',
            'description' => 'Driver de coleta para equipamentos compatíveis com IEC 61850.',
            'enabled' => true,
        ],
    ];

    foreach ($drivers as $driver) {

        $exists = DB::table('collection_drivers')
            ->where('code', $driver['code'])
            ->exists();

        if ($exists) {
            continue;
        }

        DB::table('collection_drivers')->insert([
            'code' => $driver['code'],
            'name' => $driver['name'],
            'description' => $driver['description'],
            'enabled' => $driver['enabled'],
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }
};
