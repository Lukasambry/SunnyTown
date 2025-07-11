<?php

use App\Http\Controllers\ForumCategoryController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ThreadController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\TwoFactorAuthenticationController;

// Ajoutez cette ligne

Route::get('/', [LandingController::class, 'index'])->name('home');

Route::get('/two-factor-challenge', function () {
    return Inertia::render('TwoFactorChallenge');
})->middleware('guest')->name('two-factor-challenge');


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
Route::post('/messages',[MessageController::class,'store'])->name('messages.store')->middleware('auth');

Route::middleware(['auth'])->group(function () {
    Route::get('/blog', [BlogPostController::class, 'index'])->name('blog.index');
//    Route::middleware(['can:create,App\Models\BlogPost'])->group(function () {
    Route::get('/blog/create', [BlogPostController::class, 'create'])->name('blog.create');
    Route::post('/blog', [BlogPostController::class, 'store'])->name('blog.store');
//    });

    // Routes pour la gestion de la 2FA (Setup, Activer, Confirmer, Désactiver, Codes)
    // Elles doivent être définies avant Fortify::routes() si elles partagent le même URI

    // Route GET pour afficher la page de setup 2FA
    Route::get('/two-factor/setup', [TwoFactorAuthenticationController::class, 'setup'])
        ->name('two-factor.setup');

    // Route POST pour activer la 2FA (générer le secret et les codes initiaux)
    Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'enable'])
        ->name('two-factor.enable');

    // Route POST pour confirmer la 2FA avec un code de l'application d'authentification
    Route::post('/user/confirmed-two-factor-authentication', [TwoFactorAuthenticationController::class, 'confirm'])
        ->name('two-factor.confirm'); // Nom de route non standard pour plus de clarté

    // Route DELETE pour désactiver la 2FA
    Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'disable'])
        ->name('two-factor.disable');

    // Route POST pour générer de nouveaux codes de récupération
    Route::post('/user/two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'generateRecoveryCodes'])
        ->name('two-factor.recovery-codes'); // Nom de route non standard pour plus de clarté
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
