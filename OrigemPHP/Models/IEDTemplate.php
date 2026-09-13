<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class IEDTemplate extends Model
{
    protected $table = 'ied_templates';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['ied_type_id', 'default_driver_id', 'manufacturer', 'model', 'name', 'enabled'];

    protected $casts = [
        'ied_type_id' => 'integer',
        'default_driver_id' => 'integer',
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
