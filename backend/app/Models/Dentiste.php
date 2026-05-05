<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dentiste extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'nom',
        'prenom',
        'specialite',
        'biographie',
        'photo',
    ];
}
