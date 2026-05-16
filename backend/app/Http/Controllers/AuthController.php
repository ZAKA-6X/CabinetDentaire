<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Secretaire;
use App\Models\Dentiste;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'email' => $user->email,
                'role'  => strtoupper($user->role),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email|unique:utilisateurs,email',
            'password'              => 'required|string|min:6|confirmed',
            'nom'                   => 'required',
            'prenom'                => 'required',
            'telephone'             => 'required',
            'date_naissance'        => 'required|date',
            'sexe'                  => 'required|in:masculin,feminin',
        ]);

        $user = Utilisateur::create([
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'patient',
        ]);

        Patient::create([
            'utilisateur_id'  => $user->id,
            'nom'             => $request->nom,
            'prenom'          => $request->prenom,
            'telephone'       => $request->telephone,
            'sexe'            => $request->sexe,
            'adresse'         => $request->adresse,
            'date_naissance'  => $request->date_naissance,
            'contact_urgence' => $request->contact_urgence,
            'notes_generales' => $request->notes_generales,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => [
                'id'    => $user->id,
                'email' => $user->email,
                'role'  => strtoupper($user->role),
            ],
            'token' => $token,
        ], 201);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        $data = match($user->role) {
            'patient'    => Patient::where('utilisateur_id', $user->id)->firstOrFail(),
            'dentiste'   => Dentiste::where('utilisateur_id', $user->id)->firstOrFail(),
            'secretaire' => Secretaire::where('utilisateur_id', $user->id)->firstOrFail(),
            default      => abort(403),
        };

        return response()->json([
            'user'    => [
                'id'    => $user->id,
                'email' => $user->email,
                'role'  => strtoupper($user->role),
            ],
            'profile' => $data,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'patient') {
            $patient = Patient::where('utilisateur_id', $user->id)->firstOrFail();
            $patient->update($request->only([
                'nom', 'prenom', 'telephone', 'adresse',
                'date_naissance', 'sexe', 'contact_urgence', 'notes_generales',
            ]));
            return response()->json(['profile' => $patient->fresh()]);
        }

        if ($user->role === 'dentiste') {
            $dentiste = Dentiste::where('utilisateur_id', $user->id)->firstOrFail();
            $dentiste->update($request->only(['nom', 'prenom', 'telephone', 'specialite']));
            return response()->json(['profile' => $dentiste->fresh()]);
        }

        if ($user->role === 'secretaire') {
            $sec = Secretaire::where('utilisateur_id', $user->id)->firstOrFail();
            $sec->update($request->only(['nom', 'prenom', 'telephone']));
            return response()->json(['profile' => $sec->fresh()]);
        }

        abort(403);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'ancien'  => 'required',
            'nouveau' => 'required|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($request->ancien, $user->password)) {
            throw ValidationException::withMessages([
                'ancien' => 'Ancien mot de passe incorrect.',
            ]);
        }

        $user->update(['password' => Hash::make($request->nouveau)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }
}
