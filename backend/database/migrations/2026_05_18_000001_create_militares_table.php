<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('militares', function (Blueprint $table) {
            $table->id();
            $table->string('nomecomp');
            $table->string('saram');
            $table->string('cnh');
            $table->string('venccnh')->nullable();
            $table->string('categoria')->nullable();
            $table->string('boletim')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('militares');
    }
};
