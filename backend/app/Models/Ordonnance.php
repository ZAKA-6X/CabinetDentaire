<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrdonnanceMedicament;

class Ordonnance extends Model
{
    public function medicaments() { return $this->hasMany(OrdonnanceMedicament::class); }

    protected $fillable = [
        'visite_id',
        'patient_id',
        'dentiste_id',
        'date_delivrance',
        'instructions_generales',
        'statut',
    ];
}
