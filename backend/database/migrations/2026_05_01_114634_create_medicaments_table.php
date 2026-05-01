<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('forme')->nullable();
            $table->string('dosage')->nullable();
            $table->string('fournisseur')->nullable();
            $table->decimal('prix_unitaire', 10, 2)->default(0);
            $table->integer('stock_disponible')->default(0);
            $table->date('date_expiration')->nullable();
            $table->datetime('cree_le')->useCurrent();
            $table->datetime('mis_a_jour_le')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
