<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogueOperation extends Model
{
    protected $table = 'catalogue_operations';

    protected $fillable = ['nom', 'description', 'cout'];
}
