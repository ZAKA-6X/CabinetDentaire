<?php

namespace App\Http\Controllers;
use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Secretaire;
use App\Models\Dentiste;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller{

    public function login(Request $request){
        $user = Utilisateur::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return redirect('/')->withErrors(['email' => 'Email ou mot de passe incorrect.'])->withInput();
        }

        session(['user' => $user->id, 'role' => $user->role]);
        
        return redirect('/dashboard');
    }

    public function logout(Request $request){
        $request->session()->flush();
        return redirect('/');
    }

    public function register(Request $request){

        $request->validate([
            'email'          => 'required|email|unique:utilisateurs,email',
            'password'       => 'required|min:6',
            'nom'            => 'required',
            'prenom'         => 'required',
            'telephone'      => 'required',
            'date_naissance' => 'required|date',
            'sexe'           => 'required|in:masculin,feminin',
        ]);

        $user = Utilisateur::create([
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'patient',
        ]);

        Patient::create([
            'utilisateur_id' => $user->id,
            'nom'            => $request->nom,
            'prenom'         => $request->prenom,
            'telephone'      => $request->telephone,
            'sexe'           => $request->sexe,
            'adresse'        => $request->adresse,
            'date_naissance' => $request->date_naissance,
            'contact_urgence'=> $request->contact_urgence,
            'notes_generales'=> $request->notes_generales,
        ]);

        return redirect('/')->with('success', 'Patient créé avec succès!');
    }

    public function profile(){
        $userId = session('user');
        $role   = session('role');

        $data = match($role) {
            'patient'    => Patient::where('utilisateur_id', $userId)->firstOrFail(),
            'dentiste'   => Dentiste::where('utilisateur_id', $userId)->firstOrFail(),
            'secretaire' => Secretaire::where('utilisateur_id', $userId)->firstOrFail(),
            default      => abort(403),
        };

        return $data;
    }

}
