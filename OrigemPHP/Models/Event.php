<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'agent_id',
        'ied_id',
        'type',
        'status',
        'message',
        'timestamp',
    ];

    protected $casts = [
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