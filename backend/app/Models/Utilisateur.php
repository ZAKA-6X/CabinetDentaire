<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'email',
        'password',
        'role',
        'statut',
        'derniere_connexion',
    ];

    protected $hidden = ['password'];
}
