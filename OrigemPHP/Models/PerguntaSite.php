<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class PerguntaSite extends Model
{
    protected $table = 'perguntas_site';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'titulo_pergunta',
        'descricao_pergunta',
        'empresa',
        'posicao_pergunta',
    ];

    protected $casts = [
        'id' => 'integer',
        'empresa' => 'integer',
        'posicao_pergunta' => 'integer',
    ];

   
}