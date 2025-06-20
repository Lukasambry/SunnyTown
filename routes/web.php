<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ThreadController;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;

Route::get('/', [LandingController::class, 'index'])->name('home'); // Créer une home à la place
Route::get('/landing', [LandingController::class, 'index'])->name('landing');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('forum')->name('forums.')->group(function(){
    Route::get('/', [ForumCategoryController::class, 'index'])->name('index');

    Route::get('{category:id}', [ForumCategoryController::class, 'show'])
        ->name('categories.show');

    Route::get('{category:id}/threads/{thread}', [ThreadController::class, 'show'])
        ->name('threads.show');

    Route::get('/threads/{category:id}/create', [ThreadController::class, 'create'])
        ->name('threads.create')->middleware('auth');

    Route::post('{category:id}/threads', [ThreadController::class, 'store'])
        ->name('threads.store')->middleware('auth');
});

Route::middleware('auth')->group(function(){
    Route::post('/threads',  [ThreadController::class,  'store'])->name('threads.store');
    Route::post('/messages',[MessageController::class,'store'])->name('messages.store');
})

Route::post('/messages',[MessageController::class,'store'])->name('messages.store')->middleware('auth');

Route::get('/blog', [BlogPostController::class, 'index'])->name('blog.index');
Route::middleware(['auth'])->group(function () {
//    Route::middleware(['can:create,App\Models\BlogPost'])->group(function () {
    Route::get('/blog/create', [BlogPostController::class, 'create'])->name('blog.create');
    Route::post('/blog', [BlogPostController::class, 'store'])->name('blog.store');
//    });
});

// 2FA Fortify routes
Route::prefix('/')->group(function () {
    Route::get('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'create'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('two-factor.login');

    Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')]);
});

// 2FA custom routes
Route::get('/custom-two-factor-challenge', function () {
    return Inertia::render('TwoFactor/Authentication/TwoFactorChallenge');
})->middleware('guest')->name('custom-two-factor-challenge');

Route::get('/two-factor/setup', [TwoFactorAuthenticationController::class, 'setup'])
    ->name('two-factor.setup');

Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'enable'])
    ->name('two-factor.enable');

Route::post('/user/confirmed-two-factor-authentication', [TwoFactorAuthenticationController::class, 'confirm'])
    ->name('two-factor.confirm');

Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'disable'])
    ->name('two-factor.disable');

Route::post('/user/two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'generateRecoveryCodes'])
    ->name('two-factor.recovery-codes');


Route::get('/game', [GameController::class, 'index'])->name('game.index');

Route::get('/game', [GameController::class, 'index'])->name('game.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
