<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hidrometros', function (Blueprint $table) {
            $table->increments('idhidrometros');
            $table->string('nomecoletor');
            $table->string('hidrometro');
            $table->date('datacoleta');
            $table->string('horacoleta', 20);
            $table->string('total');
            $table->string('hid_cal')->nullable();
            $table->string('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hidrometros');
    }
};
