<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', ['appEnv' => env('APP_ENV')]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/game', [GameController::class, 'index'])->name('game.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
