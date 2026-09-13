<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agents';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'version',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function ieds()
    {
        return $this->hasMany(IED::class, 'agent_id', 'id');
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'agent_id', 'id');
    }

    public function telemetry()
    {
        return $this->hasMany(Telemetry::class, 'agent_id', 'id');
    }
}