<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', ['appEnv' => env('APP_ENV')]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function(){
    Route::post('/threads',  [ThreadController::class,  'store'])->name('threads.store');
    Route::post('/messages',[MessageController::class,'store'])->name('messages.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
