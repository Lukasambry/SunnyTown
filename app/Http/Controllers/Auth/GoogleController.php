<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Utilisateur Google',
                    'password' => bcrypt(Str::random(24)),
                    'email_verified_at' => now(),
                ]
            );

            Auth::login($user, true);

            return redirect()->route('game.index');

        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['google' => 'Erreur lors de la connexion Google.']);
        }
    }
}
