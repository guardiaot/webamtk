<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class Telemetry extends Model
{
    protected $table = 'telemetry';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'integer';

    protected $fillable = [
        'agent_id',
        'ied_id',
        'timestamp',
        'ia',
        'ib',
        'ic',
        'va',
        'vb',
        'vc',
        'frequency',
    ];

    protected $casts = [
        'id' => 'integer',
        'ia' => 'float',
        'ib' => 'float',
        'ic' => 'float',
        'va' => 'float',
        'vb' => 'float',
        'vc' => 'float',
        'frequency' => 'float',
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(
            Agent::class,
            'agent_id',
            'id'
        );
    }

    public function ied()
    {
        return $this->belongsTo(
            IED::class,
            'ied_id',
            'id'
        );
    }
}