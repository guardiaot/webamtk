<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class Installation extends Model
{
    protected $table = 'installations';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['regional_id', 'state_id', 'name', 'enabled'];

    protected $casts = [
        'regional_id' => 'integer',
        'state_id' => 'integer',
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
