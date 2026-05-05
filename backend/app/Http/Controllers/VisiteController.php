<?php

namespace App\Http\Controllers;

use App\Models\Visite;
use App\Models\RendezVous;
use App\Models\OperationDentaire;
use App\Models\Facture;
use App\Models\Patient;
use App\Models\Dentiste;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisiteController extends Controller
{
    public function store(Request $request)
    {
        if (session('role') !== 'dentiste') {
            abort(403);
        }

        $request->validate([
            'rendezvous_id'    => 'required|exists:rendez_vous,id',
            'diagnostic'       => 'nullable|string',
            'traitement_fourni'=> 'nullable|string',
            'notes'            => 'nullable|string',
            'frais_visite_base'=> 'nullable|numeric|min:0',
            // operations: array of {nom_operation, description, cout}
            'operations'       => 'nullable|array',
            'operations.*.nom_operation' => 'required|string',
            'operations.*.cout'          => 'required|numeric|min:0',
            'operations.*.description'   => 'nullable|string',
        ]);

        $rdv = RendezVous::findOrFail($request->rendezvous_id);

        if ($rdv->statut !== 'confirme') {
            abort(422, 'Le rendez-vous doit être confirmé pour créer une visite.');
        }

        DB::transaction(function () use ($request, $rdv) {
            $dentisteId = Dentiste::where('utilisateur_id', session('user'))->value('id');

            // create visite
            $visite = Visite::create([
                'rendezvous_id'    => $rdv->id,
                'patient_id'       => $rdv->patient_id,
                'dentiste_id'      => $dentisteId,
                'date_visite'      => today(),
                'diagnostic'       => $request->diagnostic,
                'traitement_fourni'=> $request->traitement_fourni,
                'notes'            => $request->notes,
                'statut'           => 'complete',
            ]);

            // snapshot operations with cost at time of visit
            $fraisOperations = 0;
            foreach ($request->operations ?? [] as $op) {
                OperationDentaire::create([
                    'visite_id'     => $visite->id,
                    'nom_operation' => $op['nom_operation'],
                    'description'   => $op['description'] ?? null,
                    'cout'          => $op['cout'],
                    'date_effectuee'=> today(),
                ]);
                $fraisOperations += $op['cout'];
            }

            $fraisBase = $request->frais_visite_base ?? 0;

            // auto-create facture
            Facture::create([
                'numero_facture'   => 'FAC-' . date('Y') . '-' . str_pad($visite->id, 5, '0', STR_PAD_LEFT),
                'visite_id'        => $visite->id,
                'patient_id'       => $rdv->patient_id,
                'date_facture'     => today(),
                'frais_visite_base'=> $fraisBase,
                'frais_operations' => $fraisOperations,
                'montant_total'    => $fraisBase + $fraisOperations,
                'statut'           => 'en_attente',
            ]);

            // mark RDV complete
            $rdv->update(['statut' => 'complete']);

            AuditService::log('create', 'visites', $visite->id, null, $visite->toArray());

            $this->result = $visite->id;
        });

        $visite = Visite::with(['operations', 'facture'])->findOrFail($this->result);

        return response()->json($visite, 201);
    }

    public function show($id)
    {
        $role   = session('role');
        $userId = session('user');

        $visite = Visite::with(['operations', 'ordonnance', 'facture'])->findOrFail($id);

        if ($role === 'patient') {
            $patientId = Patient::where('utilisateur_id', $userId)->value('id');
            if ($visite->patient_id !== $patientId) abort(403);
        }

        if ($role === 'dentiste') {
            $dentisteId = Dentiste::where('utilisateur_id', $userId)->value('id');
            if ($visite->dentiste_id !== $dentisteId) abort(403);
        }

        return response()->json($visite);
    }

    public function patientVisites($id)
    {
        $role   = session('role');
        $userId = session('user');

        // patient can only see own visites
        if ($role === 'patient') {
            $patientId = Patient::where('utilisateur_id', $userId)->value('id');
            if ((int)$id !== $patientId) abort(403);
        }

        $visites = Visite::where('patient_id', $id)->orderByDesc('date_visite')->get();

        return response()->json($visites);
    }

    public function today()
    {
        if (session('role') !== 'dentiste') {
            abort(403);
        }

        $dentisteId = Dentiste::where('utilisateur_id', session('user'))->value('id');

        $visites = Visite::with(['operations', 'facture'])
            ->where('dentiste_id', $dentisteId)
            ->whereDate('date_visite', today())
            ->orderBy('date_visite')
            ->get();

        return response()->json($visites);
    }
}
