
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameSaveController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('landing');
});

// Routes API pour les sauvegardes de jeu
Route::prefix('api/game-save')->group(function () {
    Route::post('/generate-player-id', [GameSaveController::class, 'generatePlayerId']);
    Route::post('/save', [GameSaveController::class, 'save']);
    Route::get('/load', [GameSaveController::class, 'load']);
    Route::get('/load-latest', [GameSaveController::class, 'loadLatest']);
    Route::get('/list', [GameSaveController::class, 'list']);
    Route::delete('/delete', [GameSaveController::class, 'delete']);
});
