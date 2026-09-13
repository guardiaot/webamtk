<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class Regional extends Model
{
    protected $table = 'regionals';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['owner_id', 'name', 'abbreviation', 'enabled'];

    protected $casts = [
        'owner_id' => 'integer',
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
