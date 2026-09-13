<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class TransmissionFunction extends Model
{
    protected $table = 'transmission_functions';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['installation_id', 'type_id', 'name', 'enabled'];

    protected $casts = [
        'installation_id' => 'integer',
        'type_id' => 'integer',
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
