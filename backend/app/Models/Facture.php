<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Visite;

class Facture extends Model
{
    public function patient() { return $this->belongsTo(Patient::class); }
    public function visite()  { return $this->belongsTo(Visite::class); }

    protected $fillable = [
        'numero_facture',
        'visite_id',
        'patient_id',
        'secretaire_id',
        'date_facture',
        'frais_visite_base',
        'frais_operations',
        'montant_total',
        'statut',
        'date_paiement',
        'notes',
    ];
}
