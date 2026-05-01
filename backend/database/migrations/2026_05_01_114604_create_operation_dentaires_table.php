<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operation_dentaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visite_id')->constrained('visites')->onDelete('cascade');
            $table->string('nom_operation');
            $table->text('description')->nullable();
            $table->decimal('cout', 10, 2)->default(0);
            $table->date('date_effectuee');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operation_dentaires');
    }
};
