<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\Patient;
use App\Models\Dentiste;
use App\Models\Secretaire;
use App\Services\NotificationService;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RendezVousController extends Controller
{
    public function index()
    {
        $role   = session('role');
        $userId = session('user');

        $rdvs = match($role) {
            'patient' => RendezVous::where('patient_id',
                Patient::where('utilisateur_id', $userId)->value('id')
            )->get(),

            'dentiste' => RendezVous::where('statut', 'confirme')
                ->where('dentiste_id',
                    Dentiste::where('utilisateur_id', $userId)->value('id')
                )->get(),

            'secretaire' => RendezVous::all(),

            default => abort(403),
        };

        return response()->json($rdvs);
    }

    public function store(Request $request)
    {
        if (session('role') !== 'patient') {
            abort(403);
        }

        $request->validate([
            'date_heure' => 'required|date|after:now',
            'duree'      => 'nullable|integer|min:15',
            'raison'     => 'nullable|string',
        ]);

        $patientId  = Patient::where('utilisateur_id', session('user'))->value('id');
        $dentisteId = Dentiste::value('id');

        $rdv = RendezVous::create([
            'patient_id'  => $patientId,
            'dentiste_id' => $dentisteId,
            'date_heure'  => $request->date_heure,
            'duree'       => $request->duree ?? 30,
            'raison'      => $request->raison,
            'statut'      => 'en_attente',
        ]);

        AuditService::log('create', 'rendez_vous', $rdv->id, null, $rdv->toArray());

        return response()->json($rdv, 201);
    }

    public function show($id)
    {
        $role   = session('role');
        $userId = session('user');
        $rdv    = RendezVous::findOrFail($id);

        if ($role === 'patient') {
            $patientId = Patient::where('utilisateur_id', $userId)->value('id');
            if ($rdv->patient_id !== $patientId) abort(403);
        }

        if ($role === 'dentiste') {
            $dentisteId = Dentiste::where('utilisateur_id', $userId)->value('id');
            if ($rdv->dentiste_id !== $dentisteId) abort(403);
        }

        return response()->json($rdv);
    }

    public function destroy($id)
    {
        if (session('role') !== 'patient') {
            abort(403);
        }

        $rdv       = RendezVous::findOrFail($id);
        $patientId = Patient::where('utilisateur_id', session('user'))->value('id');

        if ($rdv->patient_id !== $patientId) abort(403);
        if ($rdv->statut !== 'en_attente') abort(422, 'Impossible d\'annuler un RDV déjà traité.');

        $old = $rdv->toArray();
        $rdv->update(['statut' => 'annule']);
        AuditService::log('update', 'rendez_vous', $rdv->id, $old, $rdv->fresh()->toArray());

        return response()->json(['message' => 'Rendez-vous annulé.']);
    }

    public function confirm($id)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        $rdv = RendezVous::findOrFail($id);

        $secretaireId = Secretaire::where('utilisateur_id', session('user'))->value('id');

        $old = $rdv->toArray();
        $rdv->update([
            'statut'        => 'confirme',
            'secretaire_id' => $secretaireId,
            'confirme_le'   => now(),
        ]);

        NotificationService::rdvConfirme($rdv->fresh());
        AuditService::log('update', 'rendez_vous', $rdv->id, $old, $rdv->fresh()->toArray());

        return response()->json($rdv->fresh());
    }

    public function reject(Request $request, $id)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        $request->validate([
            'raison' => 'required|string',
        ]);

        $rdv = RendezVous::findOrFail($id);

        $old = $rdv->toArray();
        $rdv->update([
            'statut' => 'annule',
            'notes'  => $request->raison,
        ]);

        NotificationService::rdvRejete($rdv->fresh(), $request->raison);
        AuditService::log('update', 'rendez_vous', $rdv->id, $old, $rdv->fresh()->toArray());

        return response()->json($rdv->fresh());
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ]);

        $date       = $request->date;
        $dentisteId = Dentiste::value('id'); // single dentiste app

        // fetch all booked time slots for that day (ignore annule/complete)
        $taken = RendezVous::where('dentiste_id', $dentisteId)
            ->whereDate('date_heure', $date)
            ->whereIn('statut', ['en_attente', 'confirme'])
            ->pluck('date_heure')
            ->map(fn($d) => Carbon::parse($d)->format('H:i')) // keep "HH:MM" only
            ->toArray();

        // generate all 30-min slots from 09:00 to 17:00, exclude taken ones
        $slots = [];
        $start = Carbon::parse("$date 09:00");
        $end   = Carbon::parse("$date 17:00");

        while ($start < $end) {
            $slot = $start->format('H:i');
            if (!in_array($slot, $taken)) {
                $slots[] = $slot;
            }
            $start->addMinutes(30);
        }

        return response()->json(['date' => $date, 'slots' => $slots]);
    }

    public function dentisteSchedule()
    {
        if (session('role') !== 'dentiste') {
            abort(403);
        }

        $dentisteId = Dentiste::where('utilisateur_id', session('user'))->value('id');

        $rdvs = RendezVous::where('dentiste_id', $dentisteId)
            ->where('statut', 'confirme')
            ->whereDate('date_heure', today())
            ->orderBy('date_heure')
            ->get();

        return response()->json($rdvs);
    }
}
