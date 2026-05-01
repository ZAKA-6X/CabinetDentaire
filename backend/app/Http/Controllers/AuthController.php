<?php

namespace App\Http\Controllers;
use App\Models\Utilisateur;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request){
        $user = Utilisateur::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)){
            return back()->withErrors(['Email ou mot de passe incorrect']);
        }

        return redirect('/home')->with('success', 'Personnage Modifié avec succès'); 
    }

    public function register(Request $request){
        $request->validate([
            'nom_complet'          => 'required|string|max:255',
            'email'                => 'required|email|unique:utilisateurs,email',
            'mot_de_passe'         => 'required|min:6',
            'telephone'            => 'nullable|string|max:20',
            'adresse'              => 'nullable|string|max:255',
            'date_naissance'       => 'nullable|date',
            'sexe'                 => 'nullable|in:masculin,feminin,autre',
            'antecedents_medicaux' => 'nullable|string',
            'allergies'            => 'nullable|string',
            'contact_urgence'      => 'nullable|string|max:255',
            'notes_generales'      => 'nullable|string',
        ]);

        $utilisateur = Utilisateur::create([
            'email'      => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role'       => 'patient',
            'statut'     => 'actif',
        ]);

        Patient::create([
            'utilisateur_id'       => $utilisateur->id,
            'nom_complet'          => $request->nom_complet,
            'telephone'            => $request->telephone,
            'adresse'              => $request->adresse,
            'date_naissance'       => $request->date_naissance,
            'sexe'                 => $request->sexe,
            'antecedents_medicaux' => $request->antecedents_medicaux,
            'allergies'            => $request->allergies,
            'contact_urgence'      => $request->contact_urgence,
            'notes_generales'      => $request->notes_generales,
        ]);

        return redirect('/home')->with('success', 'Patient enregistré avec succès');
    }

}
