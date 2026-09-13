<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class IEDType extends Model
{
    protected $table = 'ied_types';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['name', 'enabled'];

    protected $casts = [
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
