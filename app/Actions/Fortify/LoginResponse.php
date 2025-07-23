<?php
namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return redirect()->intended('/admin');
        }

        return redirect()->intended('/');
    }
}
