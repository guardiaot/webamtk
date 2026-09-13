<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::table('permissions')->insert([
        [
            'name' => 'Visualizar Proprietários',
            'slug' => 'owners.view',
            'description' => 'Permite visualizar proprietários.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Proprietários',
            'slug' => 'owners.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar proprietários.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Regionais',
            'slug' => 'regionals.view',
            'description' => 'Permite visualizar regionais.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Regionais',
            'slug' => 'regionals.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar regionais.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Instalações',
            'slug' => 'installations.view',
            'description' => 'Permite visualizar instalações.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Instalações',
            'slug' => 'installations.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar instalações.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Funções de Transmissão',
            'slug' => 'transmission_functions.view',
            'description' => 'Permite visualizar funções de transmissão.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Funções de Transmissão',
            'slug' => 'transmission_functions.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar funções de transmissão.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar IEDs',
            'slug' => 'ieds.view',
            'description' => 'Permite visualizar IEDs.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar IEDs',
            'slug' => 'ieds.manage',
            'description' => 'Permite cadastrar, editar e configurar IEDs.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Telemetria',
            'slug' => 'telemetry.view',
            'description' => 'Permite visualizar dados de telemetria.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Eventos',
            'slug' => 'events.view',
            'description' => 'Permite visualizar eventos operacionais.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar COMTRADE',
            'slug' => 'comtrade.view',
            'description' => 'Permite visualizar registros COMTRADE.',
            'enabled' => true,
        ],
        [
            'name' => 'Baixar COMTRADE',
            'slug' => 'comtrade.download',
            'description' => 'Permite baixar arquivos COMTRADE.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Oscilografia',
            'slug' => 'oscillography.view',
            'description' => 'Permite visualizar oscilografias.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Usuários',
            'slug' => 'users.view',
            'description' => 'Permite visualizar usuários.',
            'enabled' => true,
        ],
        [
            'name' => 'Gerenciar Usuários',
            'slug' => 'users.manage',
            'description' => 'Permite cadastrar, editar, ativar e desativar usuários.',
            'enabled' => true,
        ],

        [
            'name' => 'Visualizar Auditoria',
            'slug' => 'audit.view',
            'description' => 'Permite visualizar registros de auditoria.',
            'enabled' => true,
        ],
    ]);
};