<?php

use App\Http\Controllers\GameSaveController;
use Illuminate\Support\Facades\Route;

// Routes pour la sauvegarde de jeu
Route::prefix('game-save')->group(function () {
    Route::post('/save', [GameSaveController::class, 'save']);
    Route::get('/load', [GameSaveController::class, 'load']);
    Route::get('/latest', [GameSaveController::class, 'loadLatest']);
    Route::get('/list', [GameSaveController::class, 'list']);
    Route::delete('/delete', [GameSaveController::class, 'delete']);
    Route::post('/generate-player-id', [GameSaveController::class, 'generatePlayerId']);
});
