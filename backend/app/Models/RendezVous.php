<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    protected $fillable = [
        'patient_id',
        'dentiste_id',
        'secretaire_id',
        'date_heure',
        'duree',
        'raison',
        'statut',
        'notes',
        'confirme_le',
    ];
}
