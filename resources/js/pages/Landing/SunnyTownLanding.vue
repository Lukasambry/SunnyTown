<template>
    <head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17389925912"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17389925912');
        </script>
    </head>
    <SmoothScroll>
        <div class="min-h-screen overflow-x-hidden bg-[#00161A] font-sans text-white antialiased" @mousemove="handleMouseMove">
            <header class="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
                <Navbar />
            </header>

            <main>
                <section class="relative h-[130vh] overflow-hidden">
                    <div class="absolute top-0 left-0 h-auto w-full" data-parallax data-speed="-0.3">
                        <img src="/images/parallax-layers/background.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-16 left-0 h-auto w-full" data-parallax data-speed="0.4">
                        <img src="/images/parallax-layers/montagne.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-[23vh] left-1/2 h-auto -translate-x-1/2" data-parallax data-speed="-0.6">
                        <img src="/images/logo%20sunnytown.svg" class="h-auto w-[40vw] object-cover" />
                    </div>

                    <div class="absolute top-16 left-0 h-auto w-full" data-parallax data-speed="0.6">
                        <img src="/images/parallax-layers/foret.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-32 left-0 h-auto w-full" data-parallax data-speed="0.8">
                        <img src="/images/parallax-layers/arbre.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-32 left-0 h-auto w-full" data-parallax data-speed="1.2">
                        <img src="/images/parallax-layers/aventurier.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-72 left-0 h-auto w-full" data-parallax data-speed="1.5">
                        <img src="/images/parallax-layers/leafs.png" class="h-full w-full object-cover" />
                    </div>

                    <div class="absolute top-132 left-0 h-auto w-full" data-parallax data-speed="1.7">
                        <img src="/images/parallax-layers/rocks.png" class="h-full w-full object-cover" />
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]">
                    <div class="container mx-auto px-6">
                        <div class="text-center mb-16">
                            <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                Découvrez SunnyTown en Images 📸
                            </h2>
                            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                                Plongez dans l'univers coloré et captivant de notre jeu à travers ces captures d'écran
                            </p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-green-500/50">
                                <div class="aspect-video bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                                    <img src="/assets/game/ui/loading-bg-1024x571.png"
                                         class="w-full h-full object-cover"
                                         alt="bg">
                                </div>
                                <div class="p-6">
                                    <h3 class="text-xl font-bold mb-2">Vue d'ensemble de la ville</h3>
                                    <p class="text-gray-400">Admirez votre ville prospère vue du ciel</p>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-yellow-500/50">
                                <div class="aspect-video bg-gradient-to-br from-yellow-600/20 to-orange-600/20 flex items-center justify-center">
                                    <img src="/assets/game/ui/resource-collect.png"
                                         class="w-full h-full object-cover"
                                         alt="resource-collect">
                                </div>
                                <div class="p-6">
                                    <h3 class="text-xl font-bold mb-2">Collecte de ressources</h3>
                                    <p class="text-gray-400">Maîtrisez l'art de la récolte et de l'extraction</p>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
                                <div class="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                                    <img src="/assets/game/ui/ui-example.png"
                                         class="w-full h-full object-cover"
                                         alt="ui-example">
                                </div>
                                <div class="p-6">
                                    <h3 class="text-xl font-bold mb-2">Interface intuitive</h3>
                                    <p class="text-gray-400">Une interface simple et accessible à tous</p>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]">
                    <div class="container mx-auto">
                        <div class="mx-[-15px] flex flex-wrap justify-center">
                            <div class="xsm:w-full xsm:basis-full relative w-10/12 basis-10/12 px-[15px] sm:w-full sm:basis-full md:w-full md:basis-full lg:w-full lg:basis-full xl:w-10/12 xl:basis-10/12">
                                <div class="roadMap__inner">
                                    <div class="mx-[-15px] flex flex-wrap">
                                        <div class="xsm:w-full xsm:basis-full relative w-5/12 basis-5/12 px-[15px] sm:w-full sm:basis-full md:w-full md:basis-full lg:w-6/12 lg:basis-6/12 xl:w-5/12 xl:basis-5/12">
                                            <div class="roadMap__content">
                                                <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                                    Fonctionnalités du Jeu
                                                </h2>
                                                <p class="xsm:max-w-full mx-0 mt-0 mb-[35px] max-w-[95%] tracking-[1px] sm:max-w-full md:max-w-[90%] lg:max-w-[90%]">
                                                    Découvrez toutes les possibilités que SunnyTown a à offrir
                                                </p>
                                                <a href="contact.html" class="tg-btn-1 -btn-yellow">Jouer maintenant ! </a>
                                            </div>
                                            <div class="roadMap__img mt-[50px] mr-0 mb-0 ml-[-35px] lg:mt-[50px_0_0]">
                                                <img src="https://themedox.com/demo/mykd-tailwind/https://themedox.com/demo/mykd-tailwind/assets/img/others/roadmap.png"
                                                     class="tg-parallax"
                                                     data-scale="1.5"
                                                     data-orientation="down"
                                                     alt=""
                                                     style="
                                                        will-change: transform;
                                                        transform: translate3d(0px, -19px, 0px);
                                                        transition: transform 1s cubic-bezier(0, 0, 0, 1);
                                                    "/>
                                            </div>
                                        </div>
                                        <div class="xsm:w-full xsm:basis-full relative w-7/12 basis-7/12 px-[15px] sm:w-full sm:basis-full md:w-full md:basis-full lg:w-6/12 lg:basis-6/12 xl:w-7/12 xl:basis-7/12">
                                            <div class="roadMap__steps-wrap xsm:ml-0 relative ml-[60px] before:absolute before:top-0 before:left-0 before:h-full before:w-1.5 before:rounded-[5px] before:bg-gradient-to-t before:from-[#10161c] before:to-[#45f882] before:content-[''] sm:ml-0 lg:ml-0">
                                                <div class="roadMap__steps-item active xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-[0.9] before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px]">
                                                    <h3 class="title xsm:text-2xl mx-0 mt-0 mb-[22px] text-[30px] leading-none font-extrabold sm:text-2xl lg:text-[26px]">
                                                        UNE VILLE QUI PROSPÈRE ⛏️🌳🌾
                                                    </h3>
                                                    <p class="text-lg leading-relaxed whitespace-pre-line text-gray-300">
                                                        Prenez un peu d'habileté de bûcheron, un zeste d'agriculture tranquille et un chouïa de
                                                        simulation de magnat, puis mélangez le tout... et qu'est-ce que vous obtenez ? SunnyTown,
                                                        pardi ! Ni une ni deux, munissez-vous de vos outils de prédilection et lancez-vous dans
                                                        l'abattage de bois, l'extraction de minerais et la récolte de cultures pour les transformer en
                                                        biens précieux !
                                                    </p>
                                                </div>
                                                <div class="roadMap__steps-item group xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-0 before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px]">
                                                    <h3 class="title xsm:text-2xl mx-0 mt-0 mb-[22px] text-[30px] leading-none font-extrabold sm:text-2xl lg:text-[26px]">
                                                        UN JEU QUI A DU POTENTIEL ✨
                                                    </h3>
                                                    <p class="text-lg leading-relaxed whitespace-pre-line text-gray-300">
                                                        🎯 Votre objectif est simple : collecter des ressources pour préparer des produits que vous
                                                        vendrez dans votre ville. 🏞️ Graphismes captivants : Abattre des arbres, miner des roches et
                                                        récolter des champs n'a jamais été aussi agréable à regarder et à écouter ! 🏘️ Bâtissez votre
                                                        empire : mettez tout en œuvre pour devenir le magnat suprême de SunnyTown !
                                                    </p>
                                                </div>
                                                <div class="roadMap__steps-item group xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-0 before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px]">
                                                    <h3 class="title xsm:text-2xl mx-0 mt-0 mb-[22px] text-[30px] leading-none font-extrabold sm:text-2xl lg:text-[26px]">
                                                        ÇA VA ÊTRE PRODUCTIF 🌱🏭💰
                                                    </h3>
                                                    <p class="text-lg leading-relaxed whitespace-pre-line text-gray-300">
                                                        Mettez à rude épreuve votre sens de la gestion pour devenir le n° 1 des magnats de SunnyTown !
                                                        Collectez les ressources, maîtrisez le côté commercial en recrutant des habitants et en
                                                        vendant vos produits finis, histoire de vous faire un petit pactole.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px] relative">
                    <div class="container mx-auto px-6">
                        <div class="text-center mb-16">
                            <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                Ce Que Disent Nos Joueurs 💬
                            </h2>
                            <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                                Découvrez les avis authentiques de notre communauté de maires passionnés
                            </p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            <div class="relative">
                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 p-8 shadow-2xl backdrop-blur-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <div class="flex items-center mb-6">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                            M
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="font-bold text-lg">Maxime_Builder</h4>
                                            <div class="flex text-yellow-400">★★★★★</div>
                                        </div>
                                    </div>
                                    <p class="text-gray-300 italic">
                                        "SunnyTown m'a complètement accro ! Le gameplay est addictif et la progression très satisfaisante.
                                        J'adore voir ma petite ville grandir jour après jour. Un vrai plaisir !"
                                    </p>
                                </div>
                            </div>

                            <div class="relative md:mt-12">
                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 p-8 shadow-2xl backdrop-blur-md transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <div class="flex items-center mb-6">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                                            S
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="font-bold text-lg">Sarah_Farmer</h4>
                                            <div class="flex text-yellow-400">★★★★★</div>
                                        </div>
                                    </div>
                                    <p class="text-gray-300 italic">
                                        "Parfait pour se détendre après une journée chargée. Les graphismes sont magnifiques
                                        et la communauté Discord est vraiment sympa. Je recommande vivement !"
                                    </p>
                                </div>
                            </div>

                            <div class="relative md:-mt-6">
                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 p-8 shadow-2xl backdrop-blur-md transform rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <div class="flex items-center mb-6">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                                            L
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="font-bold text-lg">Lucas_Miner</h4>
                                            <div class="flex text-yellow-400">★★★★★</div>
                                        </div>
                                    </div>
                                    <p class="text-gray-300 italic">
                                        "Ce jeu est une pépite ! Simple à prendre en main mais avec une profondeur incroyable.
                                        Les mises à jour régulières maintiennent l'intérêt. Bravo aux développeurs !"
                                    </p>
                                </div>
                            </div>

                            <div class="relative">
                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 p-8 shadow-2xl backdrop-blur-md transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <div class="flex items-center mb-6">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                            E
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="font-bold text-lg">Emma_Architect</h4>
                                            <div class="flex text-yellow-400">★★★★★</div>
                                        </div>
                                    </div>
                                    <p class="text-gray-300 italic">
                                        "Idéal pour tous les âges ! Ma fille et moi jouons ensemble et c'est un super moment de partage.
                                        L'aspect familial du jeu est vraiment réussi."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center pt-[150px] pb-[150px] sm:py-[100px] relative overflow-hidden">
                    <div class="container mx-auto px-6 relative z-10">
                        <div class="max-w-4xl mx-auto text-center">
                            <div class="mb-8">
                                <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                    Prêt à Commencer Votre Aventure ?
                                </h2>
                                <p class="text-2xl text-gray-300 mb-12">
                                    Rejoignez des milliers de joueurs et construisez la ville de vos rêves dès aujourd'hui !
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                                <a href="/game" class="group relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    <span class="relative z-10">Jouer Maintenant</span>
                                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]">
                    <div class="container mx-auto px-6">
                        <div class="max-w-4xl mx-auto">
                            <div class="text-center mb-16">
                                <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                    Questions Fréquentes
                                </h2>
                                <p class="text-xl text-gray-300">
                                    Trouvez rapidement les réponses à vos questions sur SunnyTown
                                </p>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden">
                                    <button class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200">
                                        <span class="text-lg font-semibold">🎮 SunnyTown est-il gratuit ?</span>
                                        <svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="px-6 pb-6">
                                        <p class="text-gray-300">
                                            Oui ! SunnyTown est entièrement gratuit avec des achats optionnels pour accélérer votre progression.
                                            Vous pouvez profiter de toutes les fonctionnalités principales sans débourser un centime.
                                        </p>
                                    </div>
                                </div>

                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden">
                                    <button class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200">
                                        <span class="text-lg font-semibold">📱 Sur quelles plateformes puis-je jouer ?</span>
                                        <svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="px-6 pb-6">
                                        <p class="text-gray-300">
                                            SunnyTown est disponible sur PC (Windows, Mac, Linux), ainsi que sur mobile (iOS et Android).
                                            Votre progression est synchronisée entre tous vos appareils !
                                        </p>
                                    </div>
                                </div>

                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden">
                                    <button class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200">
                                        <span class="text-lg font-semibold">🏆 Y a-t-il un mode multijoueur ?</span>
                                        <svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="px-6 pb-6">
                                        <p class="text-gray-300">
                                            Actuellement, SunnyTown se concentre sur l'expérience solo, mais vous pouvez partager vos créations
                                            et comparer vos villes avec d'autres joueurs via notre communauté Discord !
                                        </p>
                                    </div>
                                </div>

                                <div class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden">
                                    <button class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200">
                                        <span class="text-lg font-semibold">⚡ À quelle fréquence sortent les mises à jour ?</span>
                                        <svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="px-6 pb-6">
                                        <p class="text-gray-300">
                                            Nous publions des mises à jour majeures tous les 2-3 mois avec de nouvelles fonctionnalités,
                                            plus des correctifs et améliorations mineures chaque semaine. Restez connectés !
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="relative bg-[#00161A] border-t border-gray-700/50">
                <div class="border-t border-gray-700/50 bg-[#000e12]">
                    <div class="container mx-auto px-6 py-6">
                        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div class="flex items-center space-x-6 text-sm text-gray-500">
                                <span>&copy; {{ new Date().getFullYear() }} SunnyTown. Tous droits réservés.</span>
                                <span class="hidden md:inline">•</span>
                                <span class="text-xs">Développé avec ❤️ pour notre communauté</span>
                            </div>

                            <div class="flex items-center space-x-6 text-sm">
                                <a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">
                                    Politique de confidentialité
                                </a>
                                <a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">
                                    Conditions d'utilisation
                                </a>
                                <a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">
                                    RGPD
                                </a>
                                <div class="flex items-center space-x-2 text-xs text-gray-600">
                                    <span>Version</span>
                                    <span class="px-2 py-1 bg-green-600/20 text-green-400 rounded">v2.1.3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <button
                v-if="showBackToTop"
                @click="scrollToTop"
                class="fixed right-6 bottom-6 z-40 h-12 w-12 rounded-lg border border-gray-700/50 bg-[#00161A]/95 text-blue-400 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/30 hover:text-blue-300 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
                <ArrowUp class="mx-auto h-6 w-6" />
            </button>

            <div id="particle-container" class="pointer-events-none fixed inset-0 z-[100]">
                <div
                    v-for="particle in particles"
                    :key="particle.id"
                    :style="{ top: particle.y + 'px', left: particle.x + 'px' }"
                    class="particle pointer-events-none absolute select-none"
                    :class="
                        particle.type === 'coins'
                            ? 'text-2xl text-yellow-400'
                            : particle.type === 'population'
                              ? 'text-2xl text-green-400'
                              : 'text-2xl text-blue-400'
                    "
                >
                    {{ particle.emoji }}
                </div>
            </div>
        </div>
    </SmoothScroll>
</template>

<script setup lang="ts">
 import { ArrowUp } from 'lucide-vue-next';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import SmoothScroll from '../../components/SmoothScroll.vue';
 import Navbar from '@/components/home/Navbar.vue';

const props = defineProps({
    meta: Object,
    stats: Object,
    features: Array,
    gameplay_features: Array,
    social_links: {
        type: Object,
        default: () => ({
            twitter: '#',
            facebook: '#',
            discord: '#',
            forum: '#',
        }),
    },
});

const coins = ref(props.stats?.active_players ? parseFloat(props.stats.active_players.replace(/\D/g, '')) / 100 : 12345);
const population = ref(props.stats?.cities_created ? parseFloat(props.stats.cities_created.replace(/\D/g, '')) / 1000 : 876);
const happiness = ref(props.stats?.happiness || 92);
const autoProgress = ref(0);
const showBackToTop = ref(false);
const particles = ref([]);

const mousePos = reactive({ x: 0, y: 0 });
const currentFeatureIndex = ref(0);

const handleMouseMove = (event) => {
    mousePos.x = event.clientX - window.innerWidth / 2;
    mousePos.y = event.clientY - window.innerHeight / 2;
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const observer = ref(null);
const featureObserver = ref(null);
const observedElements = ref([]);

onMounted(() => {
    const intervals = [];
    intervals.push(
        setInterval(() => {
            coins.value += Math.floor(Math.random() * 3) + 1;
        }, 2000),
    );
    intervals.push(
        setInterval(() => {
            population.value += Math.random() > 0.7 ? 1 : 0;
        }, 5000),
    );
    intervals.push(
        setInterval(() => {
            happiness.value = Math.min(100, Math.max(0, happiness.value + (Math.random() > 0.5 ? 1 : -1)));
        }, 3000),
    );
    intervals.push(
        setInterval(() => {
            autoProgress.value = (autoProgress.value + 1) % 101;
        }, 150),
    );
    window.sunnyTownIntervals = intervals;

    const options = { root: null, rootMargin: '0px', threshold: 0.15 };
    observer.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                entry.target.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
                observer.value.unobserve(entry.target);
            }
        });
    }, options);

    const featureOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
    };

    featureObserver.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const featureIndex = parseInt(entry.target.getAttribute('data-feature-index'));
                if (!isNaN(featureIndex)) {
                    currentFeatureIndex.value = featureIndex;
                }
            }
        });
    }, featureOptions);

    document.querySelectorAll('.needs-fade-in').forEach((el) => {
        el.classList.add('opacity-0', 'translate-y-8', 'scale-95', 'transform', 'transition-all', 'duration-1000', 'ease-out');
        observer.value.observe(el);
        observedElements.value.push(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.gameplay-feature').forEach((el) => {
            featureObserver.value.observe(el);
        });
    }, 100);
});

onUnmounted(() => {
    if (window.sunnyTownIntervals) {
        window.sunnyTownIntervals.forEach((interval) => clearInterval(interval));
    }
    if (observer.value) {
        observer.value.disconnect();
    }
    if (featureObserver.value) {
        featureObserver.value.disconnect();
    }
});
</script>

<style scoped>
* {
    scroll-behavior: smooth;
}

@keyframes particle-fade-out {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-60px) scale(0.3);
        opacity: 0;
    }
}

.particle {
    animation: particle-fade-out 1s cubic-bezier(0.17, 0.84, 0.44, 1) forwards;
}
</style>
