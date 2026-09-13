<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        ALTER TABLE collection_drivers
        ADD COLUMN IF NOT EXISTS category VARCHAR(30) NOT NULL DEFAULT 'protocol'
    ");

    DB::table('collection_drivers')->where('code', 'simulator')->update(['category' => 'strategy']);
    DB::table('collection_drivers')->where('code', 'iec61850')->update(['category' => 'protocol']);
    DB::table('collection_drivers')->where('code', 'ping')->update(['category' => 'utility']);
    DB::table('collection_drivers')->where('code', 'sel-telnet')->update(['category' => 'protocol']);
    DB::table('collection_drivers')->where('code', 'ftp')->update(['category' => 'protocol']);
    DB::table('collection_drivers')->where('code', 'mms')->update(['category' => 'service']);
    DB::table('collection_drivers')->where('code', 'vital')->update(['category' => 'integration']);
    DB::table('collection_drivers')->where('code', 'tcp-udp')->update(['category' => 'protocol']);
    DB::table('collection_drivers')->where('code', 'sem-driver')->update(['category' => 'none']);
    DB::table('collection_drivers')->where('code', 'sigro')->update(['category' => 'integration']);
    DB::table('collection_drivers')->where('code', 'ssh-putty')->update(['category' => 'protocol']);
    DB::table('collection_drivers')->where('code', 'goose')->update(['category' => 'service']);
    DB::table('collection_drivers')->where('code', 'varredurapasta')->update(['category' => 'strategy']);

    DB::statement("
        CREATE INDEX IF NOT EXISTS idx_collection_drivers_category
        ON collection_drivers (category)
    ");
};
