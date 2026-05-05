<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdonnanceMedicament extends Model
{
    protected $fillable = [
        'ordonnance_id',
        'medicament_id',
        'frequence',
        'duree_jours',
        'instructions_speciales',
    ];
}
