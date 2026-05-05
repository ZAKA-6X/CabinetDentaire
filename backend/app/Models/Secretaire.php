<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Secretaire extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'nom',
        'prenom',
        'numero_employe',
        'date_embauche',
    ];
}
