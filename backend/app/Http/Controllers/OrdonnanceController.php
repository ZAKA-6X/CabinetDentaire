<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use App\Models\OrdonnanceMedicament;
use App\Models\Patient;
use App\Models\Dentiste;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdonnanceController extends Controller
{
    public function store(Request $request)
    {
        if (session('role') !== 'dentiste') {
            abort(403);
        }

        $request->validate([
            'visite_id'              => 'required|exists:visites,id',
            'instructions_generales' => 'nullable|string',
            'medicaments'            => 'required|array|min:1',
            'medicaments.*.medicament_id'        => 'required|exists:medicaments,id',
            'medicaments.*.frequence'            => 'required|string',
            'medicaments.*.duree_jours'          => 'required|integer|min:1',
            'medicaments.*.instructions_speciales' => 'nullable|string',
        ]);

        $dentisteId = Dentiste::where('utilisateur_id', session('user'))->value('id');

        $ordonnance = DB::transaction(function () use ($request, $dentisteId) {
            $ordonnance = Ordonnance::create([
                'visite_id'              => $request->visite_id,
                'patient_id'             => \App\Models\Visite::find($request->visite_id)->patient_id,
                'dentiste_id'            => $dentisteId,
                'date_delivrance'        => today(),
                'instructions_generales' => $request->instructions_generales,
                'statut'                 => 'active',
            ]);

            foreach ($request->medicaments as $med) {
                OrdonnanceMedicament::create([
                    'ordonnance_id'         => $ordonnance->id,
                    'medicament_id'         => $med['medicament_id'],
                    'frequence'             => $med['frequence'],
                    'duree_jours'           => $med['duree_jours'],
                    'instructions_speciales'=> $med['instructions_speciales'] ?? null,
                ]);
            }

            AuditService::log('create', 'ordonnances', $ordonnance->id, null, $ordonnance->toArray());

            return $ordonnance;
        });

        return response()->json($ordonnance->load('medicaments'), 201);
    }

    public function show($id)
    {
        $role   = session('role');
        $userId = session('user');

        $ordonnance = Ordonnance::with('medicaments')->findOrFail($id);

        if ($role === 'patient') {
            $patientId = Patient::where('utilisateur_id', $userId)->value('id');
            if ($ordonnance->patient_id !== $patientId) abort(403);
        }

        return response()->json($ordonnance);
    }

    public function patientOrdonnances(Request $request, $id)
    {
        $role   = session('role');
        $userId = session('user');

        if ($role === 'patient') {
            $patientId = Patient::where('utilisateur_id', $userId)->value('id');
            if ((int)$id !== $patientId) abort(403);
        }

        $query = Ordonnance::with('medicaments')->where('patient_id', $id);

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderByDesc('date_delivrance')->get());
    }
}
