<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SunnyTown - Votre Aventure Pixelisée</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    @if(config('app.env') === 'production' && config('services.matomo.host') && config('services.matomo.site_id'))
    <script>
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u = "{{ config('services.matomo.host') }}";
            _paq.push(['setTrackerUrl', u + 'matomo.php']);
            _paq.push(['setSiteId', '{{ config('services.matomo.site_id') }}']);
            var d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.async = true;
            g.src = u + 'matomo.js';
            s.parentNode.insertBefore(g, s);
        })();
    </script>
    @endif
</head>
<body class="antialiased">
    <div id="app">
        <!-- Votre composant Vue.js principal sera monté ici -->
        {{-- Si vous voulez passer des données initiales de Laravel à Vue --}}
        {{-- <sunny-town-landing :initial-data="{{ json_encode($someData) }}"></sunny-town-landing> --}}
    </div>

    <!-- Noscript fallback pour Matomo -->
    @if(config('app.env') === 'production' && config('services.matomo.host') && config('services.matomo.site_id'))
    <noscript>
        <p><img src="{{ config('services.matomo.host') }}matomo.php?idsite={{ config('services.matomo.site_id') }}&amp;rec=1" style="border:0;" alt="" /></p>
    </noscript>
    @endif
</body>
</html>