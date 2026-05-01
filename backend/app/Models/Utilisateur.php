<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    
    protected $fillable = [
        'email',
        'mot_de_passe',
        'role',
        'statut',
        'derniere_connexion',
    ];
}
