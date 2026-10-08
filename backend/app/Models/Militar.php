<?php

namespace App\Models;

use App\Models\Concerns\UsesSichsTable;
use Illuminate\Database\Eloquent\Model;

class Militar extends Model
{
    use UsesSichsTable;

    // Isso garante que o campo 'id' apareça no JSON/Array
    protected $appends = ['id'];

    protected $fillable = [
        'posto',
        'nomecomp',
        'saram',
        'ultimapromocao',
    ];

    /**
     * Acessor para o atributo 'id'.
     * Ele retorna o valor da chave primária real (idmilitares).
     */
    public function getIdAttribute()
    {
        return $this->getKey();
    }

    protected static function sichsConfigKey(): string
    {
        return 'militares';
    }
}