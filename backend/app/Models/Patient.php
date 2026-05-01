<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'nom_complet',
        'telephone',
        'adresse',
        'date_naissance',
        'sexe',
        'antecedents_medicaux',
        'allergies',
        'contact_urgence',
        'notes_generales',
    ];
}
