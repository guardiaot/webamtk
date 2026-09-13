<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class TransmissionFunctionType extends Model
{
    protected $table = 'transmission_function_types';
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
