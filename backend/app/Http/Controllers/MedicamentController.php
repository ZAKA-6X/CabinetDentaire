<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    public function index()
    {
        if (!in_array(session('role'), ['dentiste', 'secretaire'])) {
            abort(403);
        }

        return response()->json(Medicament::all());
    }

    public function store(Request $request)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        $request->validate([
            'nom'         => 'required|string',
            'description' => 'nullable|string',
            'forme'       => 'nullable|string',
            'dosage'      => 'nullable|string',
        ]);

        $medicament = Medicament::create($request->only(['nom', 'description', 'forme', 'dosage']));

        return response()->json($medicament, 201);
    }

    public function update(Request $request, $id)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        $request->validate([
            'nom'         => 'sometimes|required|string',
            'description' => 'nullable|string',
            'forme'       => 'nullable|string',
            'dosage'      => 'nullable|string',
        ]);

        $medicament = Medicament::findOrFail($id);
        $medicament->update($request->only(['nom', 'description', 'forme', 'dosage']));

        return response()->json($medicament);
    }

    public function destroy($id)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        Medicament::findOrFail($id)->delete();

        return response()->json(['message' => 'Médicament supprimé.']);
    }
}
