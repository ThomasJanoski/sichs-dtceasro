<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeituraHidrometro extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $appends = ['id'];

    public function setTable($table)
    {
        $this->table = $table;
        $this->primaryKey = 'id'.$table;

        return $this;
    }

    public function getIdAttribute(): mixed
    {
        return $this->getKey();
    }

    public static function forTable(string $tabela): self
    {
        $model = new self;
        $model->setTable($tabela);

        return $model;
    }
}
