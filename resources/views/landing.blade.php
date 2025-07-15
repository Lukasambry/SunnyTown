<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SunnyTown - Votre Aventure Pixelisée</title>

    <!-- Fonts (si vous en utilisez via Blade, sinon géré par Vue/CSS) -->
    {{-- <link rel="preconnect" href="https://fonts.bunny.net"> --}}
    {{-- <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" /> --}}

    <!-- Styles et Scripts compilés par Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Si vous avez des styles spécifiques à la page d'accueil non gérés par Vue/Tailwind -->
    {{-- <link rel="stylesheet" href="{{ asset('css/landing-specific.css') }}"> --}}
</head>
<body class="antialiased">
    <div id="app">
        <!-- Votre composant Vue.js principal sera monté ici -->
        {{-- Si vous voulez passer des données initiales de Laravel à Vue --}}
        {{-- <sunny-town-landing :initial-data="{{ json_encode($someData) }}"></sunny-town-landing> --}}
    </div>
</body>
</html>