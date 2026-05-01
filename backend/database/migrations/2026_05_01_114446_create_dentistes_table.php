<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dentistes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('nom_complet');
            $table->string('numero_licence')->unique();
            $table->string('specialite')->nullable();
            $table->text('biographie')->nullable();
            $table->string('photo')->nullable();
            $table->string('heures_travail')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dentistes');
    }
};
