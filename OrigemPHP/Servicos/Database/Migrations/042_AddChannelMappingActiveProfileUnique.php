<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS uq_ied_channel_mapping_profiles_active ON ied_channel_mapping_profiles (ied_id, layout_fingerprint) WHERE status IN ('draft', 'confirmed')");
};
