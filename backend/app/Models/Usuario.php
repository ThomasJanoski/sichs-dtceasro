<?php

namespace App\Models;

use App\Models\Concerns\UsesSichsTable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use UsesSichsTable, Notifiable;

    protected $fillable = ['nome', 'login', 'senha', 'niveis_acesso_id'];
    protected $hidden = ['senha'];
    
    // Importante para o Eloquent não tentar criar colunas de data
    public $timestamps = false; 

    protected static function sichsConfigKey(): string
    {
        return 'usuarios';
    }
}