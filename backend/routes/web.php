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

Route::middleware(['auth.session'])->group(function () {
    Route::get('/api/patients',              [PatientController::class, 'index']);
    Route::get('/api/patients/{id}',         [PatientController::class, 'show']);
    Route::put('/api/patients/{id}',         [PatientController::class, 'update']);
    Route::get('/api/patients/{id}/history', [PatientController::class, 'history']);

    Route::get('/api/rendez-vous',                          [RendezVousController::class, 'index']);
    Route::post('/api/rendez-vous',                         [RendezVousController::class, 'store']);
    Route::get('/api/rendez-vous/available-slots',          [RendezVousController::class, 'availableSlots']);
    Route::get('/api/dentiste/schedule',                    [RendezVousController::class, 'dentisteSchedule']);
    Route::get('/api/rendez-vous/{id}',                     [RendezVousController::class, 'show']);
    Route::delete('/api/rendez-vous/{id}',                  [RendezVousController::class, 'destroy']);
    Route::put('/api/rendez-vous/{id}/confirm',             [RendezVousController::class, 'confirm']);
    Route::put('/api/rendez-vous/{id}/reject',              [RendezVousController::class, 'reject']);

    Route::post('/api/visites',                  [VisiteController::class, 'store']);
    Route::get('/api/visites/{id}',              [VisiteController::class, 'show']);
    Route::get('/api/patient/{id}/visites',      [VisiteController::class, 'patientVisites']);
    Route::get('/api/dentiste/visites/today',    [VisiteController::class, 'today']);

    Route::get('/api/operations',        [OperationController::class, 'index']);
    Route::put('/api/operations/{id}',   [OperationController::class, 'update']);

    Route::get('/api/medicaments',           [MedicamentController::class, 'index']);
    Route::post('/api/medicaments',          [MedicamentController::class, 'store']);
    Route::put('/api/medicaments/{id}',      [MedicamentController::class, 'update']);
    Route::delete('/api/medicaments/{id}',   [MedicamentController::class, 'destroy']);

    Route::post('/api/ordonnances',                      [OrdonnanceController::class, 'store']);
    Route::get('/api/ordonnances/{id}',                  [OrdonnanceController::class, 'show']);
    Route::get('/api/patient/{id}/ordonnances',          [OrdonnanceController::class, 'patientOrdonnances']);

    Route::get('/api/factures',                          [FactureController::class, 'index']);
    Route::get('/api/factures/report',                   [FactureController::class, 'report']);
    Route::get('/api/factures/{id}',                     [FactureController::class, 'show']);
    Route::get('/api/patient/{id}/factures',             [FactureController::class, 'patientFactures']);
    Route::post('/api/factures/{id}/payment',            [FactureController::class, 'payment']);

    Route::get('/api/notifications',                          [NotificationController::class, 'index']);
    Route::patch('/api/notifications/read-all',               [NotificationController::class, 'markAllRead']);
    Route::patch('/api/notifications/{id}/read',              [NotificationController::class, 'markRead']);
});