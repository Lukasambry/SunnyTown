<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Affiche la page de configuration de l'authentification à deux facteurs.
     */
    public function setup(Request $request): Response
    {
        $user = $request->user();
        $props = [];

        if ($user && $user->two_factor_secret && !$user->two_factor_confirmed_at) {
            $props['qrCodeSvg'] = $user->twoFactorQrCodeSvg();
            $props['twoFactorSecret'] = $user->two_factor_secret;
            $props['recoveryCodes'] = collect($user->recoveryCodes())->map(fn ($code) => (object) ['code' => $code])->all();
        }

        if ($user && $user->two_factor_confirmed_at) {
            $props['twoFactorEnabled'] = true;
            $props['recoveryCodes'] = collect($user->recoveryCodes())->map(fn ($code) => (object) ['code' => $code])->all();
        } else {
            $props['twoFactorEnabled'] = false;
        }

        return Inertia::render('TwoFactorAuthentication/Setup', $props);
    }

    /**
     * Active l'authentification à deux facteurs pour l'utilisateur.
     */
    public function enable(Request $request, EnableTwoFactorAuthentication $enable): RedirectResponse
    {
        $user = $request->user();

        if ($user->two_factor_secret || $user->two_factor_confirmed_at) {
            return redirect()->route('two-factor.setup');
        }

        $enable($user);

        return redirect()->route('two-factor.setup')
            ->with('success', 'Two-factor authentication enabled. Please confirm using your authenticator app.');
    }

    /**
     * Confirme l'authentification à deux facteurs pour l'utilisateur.
     */
    public function confirm(Request $request, ConfirmTwoFactorAuthentication $confirmation)
    {
        $user = $request->user();

        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            $confirmation($user, $request->input('code'));

            return redirect()->route('two-factor.setup')
                ->with('success', 'Two-factor authentication confirmed successfully.');

        } catch (ValidationException $e) {
            return redirect()->route('two-factor.setup')
                ->withErrors(['code' => __('The provided two factor authentication code was invalid.')])
                ->withInput($request->only('code'));
        }
    }

    /**
     * Désactive l'authentification à deux facteurs pour l'utilisateur.
     */
    public function disable(Request $request, DisableTwoFactorAuthentication $disable): RedirectResponse
    {
        $user = $request->user();

        if (!$user->two_factor_secret && !$user->two_factor_confirmed_at) {
            return redirect()->route('two-factor.setup');
        }

        $disable($user);

        return redirect()->route('two-factor.setup')
            ->with('success', 'Two-factor authentication disabled successfully.');
    }

    /**
     * Génère de nouveaux codes de récupération pour l'utilisateur.
     */
    public function generateRecoveryCodes(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->two_factor_secret || !$user->two_factor_confirmed_at) {
            return redirect()->route('two-factor.setup')
                ->with('error', 'Two-factor authentication is not enabled or confirmed.');
        }
        $newCodes = (new GenerateNewRecoveryCodes)($user);
        if (!$newCodes) {
            return redirect()->route('two-factor.setup')
                ->with('error', 'Failed to generate new recovery codes.');
        }

        return redirect()->route('two-factor.setup')
            ->with('success', 'New recovery codes generated successfully.');
    }
}
