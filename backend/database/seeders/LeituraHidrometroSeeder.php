<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LeituraHidrometroSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now()->toDateString();

        // If per-hidrometer tables exist (hidrometro02..hidrometro11), seed the primary one
        if (DB::getSchemaBuilder()->hasTable('hidrometros')) {
            DB::table('hidrometros')->insert([
                [
                    'nomecoletor' => 'Operador C',
                    'hidrometro' => '12360',
                    'datacoleta' => $now,
                    'horacoleta' => '10:00',
                    'total' => '0.500',
                    'hid_cal' => null,
                    'observacoes' => 'Terceira leitura',
                ],
            ]);
        }
    }
}
