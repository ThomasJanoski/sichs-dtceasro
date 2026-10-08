<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('secret123'),
        ]);

        \App\Models\Usuario::create([
            'nome' => 'Administrador SISOS',
            'login' => 'admin',
            'senha' => bcrypt('admin123'),
            'niveis_acesso_id' => 1,
        ]);

        // Seed sample hidrometro leituras for development
        $this->call([
            HidrometroSeeder::class,
            LeituraHidrometroSeeder::class,
        ]);
    }
}
