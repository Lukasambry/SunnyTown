<?php

use App\Http\Controllers\GameSaveController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route de vérification de santé du serveur
Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Server is running',
        'timestamp' => now()->toISOString(),
    ]);
});

// Routes API pour les sauvegardes de jeu (automatiquement préfixées par /api/)
Route::prefix('game-save')->group(function () {
    Route::post('/generate-player-id', [GameSaveController::class, 'generatePlayerId']);
    Route::post('/save', [GameSaveController::class, 'save']);
    Route::get('/load', [GameSaveController::class, 'load']);
    Route::get('/load-latest', [GameSaveController::class, 'loadLatest']);
    Route::get('/list', [GameSaveController::class, 'list']);
    Route::delete('/delete', [GameSaveController::class, 'delete']);
});
