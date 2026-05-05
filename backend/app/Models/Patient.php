<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'nom',
        'prenom',
        'telephone',
        'adresse',
        'date_naissance',
        'sexe',
        'contact_urgence',
        'notes_generales',
    ];
}
