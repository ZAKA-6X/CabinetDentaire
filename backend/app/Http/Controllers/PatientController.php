<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Visite;
use App\Models\Ordonnance;
use App\Models\Facture;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $role = session('role');

        if (!in_array($role, ['secretaire', 'dentiste'])) {
            abort(403);
        }

        return Patient::all();
    }

    public function show($id)
    {
        $role   = session('role');
        $userId = session('user');

        $patient = Patient::findOrFail($id);

        if ($role === 'patient' && $patient->utilisateur_id !== $userId) {
            abort(403);
        }

        return $patient;
    }

    public function update(Request $request, $id)
    {
        $role   = session('role');
        $userId = session('user');

        $patient = Patient::findOrFail($id);

        if ($role === 'patient' && $patient->utilisateur_id !== $userId) {
            abort(403);
        }

        $request->validate([
            'nom'             => 'required',
            'prenom'          => 'required',
            'telephone'       => 'required',
            'adresse'         => 'nullable',
            'date_naissance'  => 'required|date',
            'sexe'            => 'required|in:masculin,feminin',
            'contact_urgence' => 'nullable',
            'notes_generales' => 'nullable',
        ]);

        $patient->update($request->only([
            'nom', 'prenom', 'telephone', 'adresse',
            'date_naissance', 'sexe', 'contact_urgence', 'notes_generales',
        ]));

        return redirect('/dashboard')->with('success', 'Patient updated avec succès!');
    }

    public function history($id)
    {
        $role   = session('role');
        $userId = session('user');

        $patient = Patient::findOrFail($id);

        if ($role === 'patient' && $patient->utilisateur_id !== $userId) {
            abort(403);
        }

        return response()->json([
            'visites'      => Visite::where('patient_id', $id)->get(),
            'ordonnances'  => Ordonnance::where('patient_id', $id)->get(),
            'factures'     => Facture::where('patient_id', $id)->get(),
        ]);
    }
}
