<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class HidrometroSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now()->toDateString();

        // Seed a few sample leituras into the primary 'hidrometros' table so the UI has data
        DB::table('hidrometros')->insert([
            [
                'nomecoletor' => 'Operador A',
                'hidrometro' => '12345',
                'datacoleta' => $now,
                'horacoleta' => '08:30',
                'total' => '12.345',
                'hid_cal' => null,
                'observacoes' => 'Registro inicial',
            ],
            [
                'nomecoletor' => 'Operador B',
                'hidrometro' => '12350',
                'datacoleta' => $now,
                'horacoleta' => '09:15',
                'total' => '7.890',
                'hid_cal' => null,
                'observacoes' => 'Segunda leitura',
            ],
        ]);
    }
}
