<?php

namespace App\Models\Concerns;

trait UsesSichsTable
{
    abstract protected static function sichsConfigKey(): string;

    // O Laravel chama automaticamente métodos que começam com 'initialize'
    public function initializeUsesSichsTable()
    {
        $config = config('sichs.' . static::sichsConfigKey());

        if ($config) {
            $this->table = $config['table'];
            $this->primaryKey = $config['primary_key'];
            // Tabelas legadas geralmente não têm timestamps, forçamos false se não houver no config
            $this->timestamps = (bool) ($config['timestamps'] ?? false);
        }
    }

    public function getKeyName()
    {
        return $this->primaryKey;
    }
}