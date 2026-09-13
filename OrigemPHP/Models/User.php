<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'enabled',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'access_token',
        'remember_me_token',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
