<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationDentaire extends Model
{
    protected $fillable = [
        'visite_id',
        'nom_operation',
        'description',
        'cout',
        'date_effectuee',
    ];
}
