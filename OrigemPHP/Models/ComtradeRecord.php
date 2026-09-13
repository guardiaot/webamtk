<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class ComtradeRecord extends Model
{
    protected $table = 'comtrade_records';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'ied_id',
        'agent_id',
        'station_name',
        'device_id',
        'trigger_reason',
        'nominal_frequency',
        'sample_rate',
        'total_samples',
        'analog_channels',
        'digital_channels',
        'duration',
        'timestamp',
        'file_cfg',
        'file_dat',
        'status',
    ];

    protected $casts = [
        'nominal_frequency' => 'float',
        'sample_rate' => 'integer',
        'total_samples' => 'integer',
        'analog_channels' => 'integer',
        'digital_channels' => 'integer',
        'duration' => 'float',
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function ied()
    {
        return $this->belongsTo(
            IED::class,
            'ied_id',
            'id'
        );
    }

    public function agent()
    {
        return $this->belongsTo(
            Agent::class,
            'agent_id',
            'id'
        );
    }
}
