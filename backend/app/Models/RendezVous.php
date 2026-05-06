<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class RendezVous extends Model
{
    protected $fillable = [
        'patient_id', 'dentiste_id', 'secretaire_id',
        'date_heure', 'duree', 'raison', 'statut', 'notes', 'confirme_le',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentiste()
    {
        return $this->belongsTo(Dentiste::class);
    }

    // Return frontend-friendly shape
    public function toFrontend(): array
    {
        $dt = Carbon::parse($this->date_heure);
        $statusMap = [
            'en_attente' => 'EN_ATTENTE',
            'confirme'   => 'CONFIRMÉ',
            'annule'     => 'ANNULÉ',
            'complete'   => 'COMPLÉTÉ',
        ];
        return [
            'id'       => $this->id,
            'date'     => $dt->format('Y-m-d'),
            'heure'    => $dt->format('H:i'),
            'duration' => $this->duree,
            'statut'   => $statusMap[$this->statut] ?? strtoupper($this->statut),
            'notes'    => $this->notes,
            'raison'   => $this->raison,
            'patient'  => $this->patient ? [
                'id'        => $this->patient->id,
                'nom'       => $this->patient->nom,
                'prenom'    => $this->patient->prenom,
                'telephone' => $this->patient->telephone,
            ] : null,
        ];
    }
}
