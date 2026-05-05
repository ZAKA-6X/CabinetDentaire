<?php

namespace App\Http\Controllers;

use App\Models\CatalogueOperation;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function index()
    {
        return response()->json(CatalogueOperation::all());
    }

    public function update(Request $request, $id)
    {
        if (session('role') !== 'secretaire') {
            abort(403);
        }

        $request->validate([
            'cout' => 'required|numeric|min:0',
        ]);

        $operation = CatalogueOperation::findOrFail($id);
        $operation->update(['cout' => $request->cout]);

        return response()->json($operation);
    }
}
