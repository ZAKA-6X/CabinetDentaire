<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'action',
        'table_affectee',
        'id_enregistrement',
        'ancienne_valeur',
        'nouvelle_valeur',
        'adresse_ip',
    ];
}
