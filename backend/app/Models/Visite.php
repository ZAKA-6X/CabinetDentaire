<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OperationDentaire;
use App\Models\Ordonnance;
use App\Models\Facture;
use App\Models\Patient;
use App\Models\Dentiste;

class Visite extends Model
{
    public function operations() { return $this->hasMany(OperationDentaire::class); }
    public function ordonnance() { return $this->hasOne(Ordonnance::class); }
    public function facture()    { return $this->hasOne(Facture::class); }
    public function patient()    { return $this->belongsTo(Patient::class); }
    public function dentiste()   { return $this->belongsTo(Dentiste::class); }

    protected $fillable = [
        'rendezvous_id',
        'patient_id',
        'dentiste_id',
        'date_visite',
        'diagnostic',
        'traitement_fourni',
        'notes',
        'statut',
    ];
}
