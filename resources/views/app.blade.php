<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17389925912"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17389925912');
        </script>

       <script>
  (function() {
    const appearance = '{{ $appearance ?? "system" }}';
    if (appearance === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }

    var _paq = window._paq = window._paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);

    (function() {
      var u = "//matomo.florddev.fr/";
      _paq.push(['setTrackerUrl', u + 'matomo.php']);
      _paq.push(['setSiteId', '1']);
      var d = document,
          g = d.createElement('script'),
          s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = u + 'matomo.js';
      s.parentNode.insertBefore(g, s);
    })();
  })();
</script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: var(--color-background);
            }

            html.dark {
                background-color: var(--color-background);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- 100% privacy-first analytics -->
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
    </body>
</html>
