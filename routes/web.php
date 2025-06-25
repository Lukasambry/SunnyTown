<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BlogPostController;

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

Route::middleware(['auth'])->group(function () {
    Route::get('/blog', [BlogPostController::class, 'index'])->name('blog.index');
//    Route::middleware(['can:create,App\Models\BlogPost'])->group(function () {
        Route::get('/blog/create', [BlogPostController::class, 'create'])->name('blog.create');
        Route::post('/blog', [BlogPostController::class, 'store'])->name('blog.store');
//    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
