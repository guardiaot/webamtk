<?php

//namespace App\Models;
namespace OrigemPHP\Servicos\Usuarios\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OrigemPHP\Servicos\Permissoes\Model\grupoModel;
use OrigemPHP\Servicos\Pessoas\Model\PessoaModel;

class UserModel extends Model
{
    use HasFactory;

    // Nome da tabela (opcional se for 'pessoas')
    protected $table = 'users';

    // Chave primária (opcional se for 'id')
    protected $primaryKey = 'id';

    // Auto-increment? true por padrão
    public $incrementing = true;

    // Se não houver timestamps
    public $timestamps = true;
    // Campos que não serão expostos em toArray() ou toJson()
    protected $hidden = [
        'password',
        'access_token'
    ];

    // Campos permitidos para inserção/atualização
    protected $fillable = [
        'id_pessoa',
        'usuario',
        'nivel',
        'status',
        'ip',
        'data_now'        
    ];


    // Tipos nativos
    protected $casts = [
        'status' => 'boolean',
    ];

    public function pessoa()
    {
        return $this->belongsTo( PessoaModel::class, 'id' );
    }

    public function grupo()
    {
        return $this->belongsTo( GrupoModel::class, 'id_grupo', 'id');
    }

   
}