<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionDriver extends Model
{
    protected $table = 'collection_drivers';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['code', 'name', 'description', 'enabled'];

    protected $casts = [
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
