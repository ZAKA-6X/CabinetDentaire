<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\VisiteController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\OrdonnanceController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\roleMiddleware;

Route::get('/', function () {
    return view('login');
});

Route::get('/dashboard', function () {
    return match(session('role')) {
        'patient'    => view('dashboard_Patient'),
        'dentiste'   => view('dashboard_Dentiste'),
        'secretaire' => view('dashboard_Secretaire'),
        default      => redirect('/'),
    };
})->middleware(['auth.session']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/profile', [AuthController::class, 'profile'])->middleware(['auth.session']);

// Business API routes moved to routes/api.php (Sanctum token auth)