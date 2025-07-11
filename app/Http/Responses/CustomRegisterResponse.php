<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomRegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request): Response
    {
        // Redirige vers la configuration 2FA si demandé lors de l'inscription
        if ($request->boolean('enable_2fa')) {
            return redirect()->route('two-factor.setup');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
