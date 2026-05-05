<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
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
