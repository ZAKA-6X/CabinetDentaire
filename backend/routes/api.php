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

Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/me',       [AuthController::class, 'profile']);
    Route::put('/me',       [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    Route::get('/patients',              [PatientController::class, 'index']);
    Route::get('/patients/{id}',         [PatientController::class, 'show']);
    Route::put('/patients/{id}',         [PatientController::class, 'update']);
    Route::get('/patients/{id}/history', [PatientController::class, 'history']);

    Route::get('/rendez-vous',                    [RendezVousController::class, 'index']);
    Route::post('/rendez-vous',                   [RendezVousController::class, 'store']);
    Route::get('/rendez-vous/available-slots',    [RendezVousController::class, 'availableSlots']);
    Route::get('/dentiste/schedule',              [RendezVousController::class, 'dentisteSchedule']);
    Route::get('/rendez-vous/{id}',               [RendezVousController::class, 'show']);
    Route::delete('/rendez-vous/{id}',            [RendezVousController::class, 'destroy']);
    Route::put('/rendez-vous/{id}/confirm',       [RendezVousController::class, 'confirm']);
    Route::put('/rendez-vous/{id}/reject',        [RendezVousController::class, 'reject']);

    Route::post('/visites',               [VisiteController::class, 'store']);
    Route::get('/visites/{id}',           [VisiteController::class, 'show']);
    Route::get('/patient/{id}/visites',   [VisiteController::class, 'patientVisites']);
    Route::get('/dentiste/visites/today', [VisiteController::class, 'today']);

    Route::get('/operations',      [OperationController::class, 'index']);
    Route::put('/operations/{id}', [OperationController::class, 'update']);

    Route::get('/medicaments',          [MedicamentController::class, 'index']);
    Route::post('/medicaments',         [MedicamentController::class, 'store']);
    Route::put('/medicaments/{id}',     [MedicamentController::class, 'update']);
    Route::delete('/medicaments/{id}',  [MedicamentController::class, 'destroy']);

    Route::post('/ordonnances',              [OrdonnanceController::class, 'store']);
    Route::get('/ordonnances/{id}',          [OrdonnanceController::class, 'show']);
    Route::get('/patient/{id}/ordonnances',  [OrdonnanceController::class, 'patientOrdonnances']);

    Route::get('/factures',              [FactureController::class, 'index']);
    Route::get('/factures/report',       [FactureController::class, 'report']);
    Route::get('/factures/{id}',         [FactureController::class, 'show']);
    Route::get('/patient/{id}/factures', [FactureController::class, 'patientFactures']);
    Route::post('/factures/{id}/payment',[FactureController::class, 'payment']);

    Route::get('/notifications',              [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all',   [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{id}/read',  [NotificationController::class, 'markRead']);
});
