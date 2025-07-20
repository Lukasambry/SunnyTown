<template>
    <SmoothScroll>
        <div class="min-h-screen overflow-x-hidden bg-[#00161A] font-sans text-white antialiased" @mousemove="handleMouseMove">
            <!-- Header modernisé avec style glass -->
            <header class="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
                <nav class="container mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-8">
                            <a href="#home" @click="trackNavigation('home')" class="text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:text-blue-400">
                                ACCUEIL
                            </a>
                            <a href="#features" @click="trackNavigation('features')" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"> JEU </a>
                            <a href="#community" @click="trackNavigation('community')" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"> COMMUNAUTÉ </a>
                            <a href="/forum" @click="trackNavigation('forum')" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"> FORUM </a>
                            <a href="/blog" @click="trackNavigation('blog')" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"> BLOG </a>
                        </div>

                        <div class="flex items-center space-x-4">
                            <a :href="props.social_links?.twitter || '#'" @click="trackSocialClick('twitter')" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20"
                                >
                                    <Twitter class="h-5 w-5 text-gray-400 hover:text-blue-400" />
                                </div>
                            </a>
                            <a :href="props.social_links?.facebook || '#'" @click="trackSocialClick('facebook')" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20"
                                >
                                    <Facebook class="h-5 w-5 text-gray-400 hover:text-blue-400" />
                                </div>
                            </a>
                            <a :href="props.social_links?.discord || '#'" @click="trackSocialClick('discord')" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-600/20"
                                >
                                    <MessageCircle class="h-5 w-5 text-gray-400 hover:text-indigo-400" />
                                </div>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <section class="relative h-[130vh] overflow-hidden" data-section="hero">
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

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]" data-section="screenshots">
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
                            <div @click="trackScreenshotClick('ville')" class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-green-500/50 cursor-pointer">
                                <div class="aspect-video bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                                    <div class="text-6xl">🏘️</div>
                                </div>
                                <div class="p-6">
                                    <h3 class="text-xl font-bold mb-2">Vue d'ensemble de la ville</h3>
                                    <p class="text-gray-400">Admirez votre ville prospère vue du ciel</p>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div @click="trackScreenshotClick('ressources')" class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-yellow-500/50 cursor-pointer">
                                <div class="aspect-video bg-gradient-to-br from-yellow-600/20 to-orange-600/20 flex items-center justify-center">
                                    <div class="text-6xl">⚡</div>
                                </div>
                                <div class="p-6">
                                    <h3 class="text-xl font-bold mb-2">Collecte de ressources</h3>
                                    <p class="text-gray-400">Maîtrisez l'art de la récolte et de l'extraction</p>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div @click="trackScreenshotClick('interface')" class="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-purple-500/50 cursor-pointer">
                                <div class="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                                    <div class="text-6xl">🎯</div>
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

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]" data-section="features" id="features">
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
                                                <a href="/game" @click="trackCTA('play_now', MATOMO_GOALS.PLAY_NOW)" class="tg-btn-1 -btn-yellow">Jouer maintenant ! </a>
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
                                                <div @click="trackFeatureClick('ville_prospere')" class="roadMap__steps-item active xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-[0.9] before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px] cursor-pointer">
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
                                                <div @click="trackFeatureClick('potentiel')" class="roadMap__steps-item group xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-0 before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px] cursor-pointer">
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
                                                <div @click="trackFeatureClick('productif')" class="roadMap__steps-item group xsm:ml-[35px] xsm:mr-0 xsm:mt-0 xsm:mb-5 xsm:px-[25px] xsm:py-[35px] xsm:before:!left-[-34px] relative mt-0 mr-0 mb-5 ml-[45px] rounded-lg rounded-xl border border-gray-700/50 bg-[#1b242e] bg-[#00161A]/95 p-[45px] shadow-2xl drop-shadow-[0px_3px_7px_0px_rgba(0,0,0,0.21)] backdrop-blur-md before:absolute before:top-2/4 before:left-[-39px] before:h-0 before:w-0 before:-translate-y-2/4 before:border-t-[20px] before:border-r-0 before:border-b-[20px] before:border-l-[18px] before:border-solid before:border-[transparent_transparent_transparent_#45f882] before:opacity-0 before:content-[''] last:mb-0 sm:mt-0 sm:mr-0 sm:mb-5 sm:ml-[35px] sm:px-[25px] sm:py-[35px] sm:before:!left-[-34px] cursor-pointer">
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

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px] relative" data-section="testimonials">
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
                            <div @click="trackTestimonialClick('maxime')" class="relative cursor-pointer">
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

                            <div @click="trackTestimonialClick('sarah')" class="relative md:mt-12 cursor-pointer">
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

                            <div @click="trackTestimonialClick('lucas')" class="relative md:-mt-6 cursor-pointer">
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

                            <div @click="trackTestimonialClick('emma')" class="relative cursor-pointer">
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

                <section class="xsm:py-[100px] bg-cover bg-center pt-[150px] pb-[150px] sm:py-[100px] relative overflow-hidden" data-section="cta">
                    <div class="container mx-auto px-6 relative z-10">
                        <div class="max-w-4xl mx-auto text-center">
                            <div class="mb-8">
                                <div class="text-8xl mb-6">🎉</div>
                                <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                    Prêt à Commencer Votre Aventure ?
                                </h2>
                                <p class="text-2xl text-gray-300 mb-12">
                                    Rejoignez des milliers de joueurs et construisez la ville de vos rêves dès aujourd'hui !
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                                <a href="/game" @click="trackCTA('play_now_main', MATOMO_GOALS.PLAY_NOW)" class="group relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    <span class="relative z-10">🚀 Jouer Maintenant</span>
                                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="xsm:py-[100px] bg-cover bg-center py-48 sm:py-[100px]" data-section="faq">
                    <div class="container mx-auto px-6">
                        <div class="max-w-4xl mx-auto">
                            <div class="text-center mb-16">
                                <h2 class="title xsm:text-[40px] mx-0 mt-0 mb-7 text-[55px] leading-none font-extrabold tracking-[3px] sm:text-[40px] md:text-[50px] lg:text-[50px]">
                                    Questions Fréquentes ❓
                                </h2>
                                <p class="text-xl text-gray-300">
                                    Trouvez rapidement les réponses à vos questions sur SunnyTown
                                </p>
                            </div>

                            <div class="space-y-4">
                                <div @click="trackFAQClick('gratuit')" class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden cursor-pointer">
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

                                <div @click="trackFAQClick('plateformes')" class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden cursor-pointer">
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

                                <div @click="trackFAQClick('multijoueur')" class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden cursor-pointer">
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

                                <div @click="trackFAQClick('maj')" class="rounded-xl border border-gray-700/50 bg-[#00161A]/95 backdrop-blur-md overflow-hidden cursor-pointer">
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
                <!-- Section principale du footer -->
                <div class="container mx-auto px-6 py-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        <!-- Logo et description -->
                        <div class="lg:col-span-1">
                            <div class="mb-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl">
                                        🏘️
                                    </div>
                                    <h3 class="text-2xl font-bold text-white">SunnyTown</h3>
                                </div>
                                <p class="text-gray-400 text-sm leading-relaxed mb-6">
                                    Construisez, gérez et développez la ville de vos rêves dans l'univers enchanteur de SunnyTown.
                                    Rejoignez notre communauté de bâtisseurs passionnés !
                                </p>

                                <!-- Réseaux sociaux -->
                                <div class="flex space-x-4">
                                    <a :href="props.social_links?.discord || '#'" @click="trackSocialClick('discord_footer')" target="_blank" rel="noopener noreferrer"
                                       class="group w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-600/20">
                                        <MessageCircle class="w-5 h-5 text-gray-400 group-hover:text-indigo-400" />
                                    </a>
                                    <a :href="props.social_links?.twitter || '#'" @click="trackSocialClick('twitter_footer')" target="_blank" rel="noopener noreferrer"
                                       class="group w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                                        <Twitter class="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                                    </a>
                                    <a :href="props.social_links?.facebook || '#'" @click="trackSocialClick('facebook_footer')" target="_blank" rel="noopener noreferrer"
                                       class="group w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                                        <Facebook class="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                                    </a>
                                    <a href="#" @click="trackSocialClick('youtube_footer')" target="_blank" rel="noopener noreferrer"
                                       class="group w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-red-500/50 hover:bg-red-600/20">
                                        <Youtube class="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation du jeu -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-6 flex items-center">
                                🎮 <span class="ml-2">Le Jeu</span>
                            </h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="#features" @click="trackFooterLink('features')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Fonctionnalités
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('guide')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Guide du débutant
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('updates')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Mises à jour
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('gameplay')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Système de jeu
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('download')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-pink-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Télécharger
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Communauté -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-6 flex items-center">
                                👥 <span class="ml-2">Communauté</span>
                            </h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="#community" @click="trackFooterLink('discord')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Discord officiel
                                    </a>
                                </li>
                                <li>
                                    <a href="/forum" @click="trackFooterLink('forum')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-teal-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Forum
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('events')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-orange-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Événements
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('contests')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-red-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Concours
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('gallery')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Galerie des joueurs
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Support et légal -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-6 flex items-center">
                                🛠️ <span class="ml-2">Support</span>
                            </h4>
                            <ul class="space-y-3 mb-8">
                                <li>
                                    <a href="#" @click="trackFooterLink('help')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Centre d'aide
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('faq')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('bug_report')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Signaler un bug
                                    </a>
                                </li>
                                <li>
                                    <a href="#" @click="trackFooterLink('contact')" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                                        <span class="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                                        Nous contacter
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Barre de statistiques -->
                <div class="border-t border-gray-700/50 bg-gray-900/30">
                    <div class="container mx-auto px-6 py-8">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div @click="trackStatsClick('coins')" class="cursor-pointer">
                                <div class="text-2xl font-bold text-yellow-400 mb-1">{{ coins.toLocaleString() }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Pièces générées</div>
                            </div>
                            <div @click="trackStatsClick('population')" class="cursor-pointer">
                                <div class="text-2xl font-bold text-green-400 mb-1">{{ population.toLocaleString() }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Joueurs actifs</div>
                            </div>
                            <div @click="trackStatsClick('happiness')" class="cursor-pointer">
                                <div class="text-2xl font-bold text-blue-400 mb-1">{{ happiness }}%</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Satisfaction</div>
                            </div>
                            <div @click="trackStatsClick('support')" class="cursor-pointer">
                                <div class="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Support</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Copyright et liens légaux -->
                <div class="border-t border-gray-700/50 bg-[#000e12]">
                    <div class="container mx-auto px-6 py-6">
                        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div class="flex items-center space-x-6 text-sm text-gray-500">
                                <span>&copy; {{ new Date().getFullYear() }} SunnyTown. Tous droits réservés.</span>
                                <span class="hidden md:inline">•</span>
                                <span class="text-xs">Développé avec ❤️ pour notre communauté</span>
                            </div>

                            <div class="flex items-center space-x-6 text-sm">
                                <a href="#" @click="trackLegalClick('privacy')" class="text-gray-500 hover:text-white transition-colors duration-200">
                                    Politique de confidentialité
                                </a>
                                <a href="#" @click="trackLegalClick('terms')" class="text-gray-500 hover:text-white transition-colors duration-200">
                                    Conditions d'utilisation
                                </a>
                                <a href="#" @click="trackLegalClick('gdpr')" class="text-gray-500 hover:text-white transition-colors duration-200">
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
                @click="handleBackToTop"
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
import { ArrowUp, Facebook, MessageCircle, Twitter, Youtube } from 'lucide-vue-next';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import SmoothScroll from '../../components/SmoothScroll.vue';
import { useMatomo, MATOMO_GOALS } from '../../composables/useMatomo';

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

const matomo = useMatomo();

const coins = ref(props.stats?.active_players ? parseFloat(props.stats.active_players.replace(/\D/g, '')) / 100 : 12345);
const population = ref(props.stats?.cities_created ? parseFloat(props.stats.cities_created.replace(/\D/g, '')) / 1000 : 876);
const happiness = ref(props.stats?.happiness || 92);
const autoProgress = ref(0);
const showBackToTop = ref(false);
const particles = ref([]);

const mousePos = reactive({ x: 0, y: 0 });
const currentFeatureIndex = ref(0);

const trackNavigation = (section: string) => {
    matomo.trackNavigation(section);
};

const trackSocialClick = (platform: string) => {
    matomo.trackUserAction('social_click', platform);
    if (platform === 'discord') {
        matomo.trackGoal(MATOMO_GOALS.DISCORD_JOIN);
    }
};

const trackCTA = (action: string, goalId?: number) => {
    matomo.trackCTA(action, goalId);
};

const trackScreenshotClick = (type: string) => {
    matomo.trackUserAction('screenshot_click', type);
};

const trackFeatureClick = (feature: string) => {
    matomo.trackUserAction('feature_click', feature);
};

const trackTestimonialClick = (testimonial: string) => {
    matomo.trackUserAction('testimonial_click', testimonial);
};

const trackFAQClick = (question: string) => {
    matomo.trackUserAction('faq_click', question);
};

const trackFooterLink = (link: string) => {
    matomo.trackUserAction('footer_link', link);
};

const trackLegalClick = (legal: string) => {
    matomo.trackUserAction('legal_click', legal);
};

const trackStatsClick = (stat: string) => {
    matomo.trackUserAction('stats_click', stat);
};

const trackSectionView = (section: string) => {
    matomo.trackEngagement('section_view', section);
};

const trackTimeSpent = (section: string, timeSpent: number) => {
    matomo.trackEngagement('time_spent', timeSpent);
};

const handleMouseMove = (event) => {
    mousePos.x = event.clientX - window.innerWidth / 2;
    mousePos.y = event.clientY - window.innerHeight / 2;
};

const handleBackToTop = () => {
    matomo.trackUserAction('back_to_top', 'click');
    scrollToTop();
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const observer = ref(null);
const featureObserver = ref(null);
const observedElements = ref([]);

const sectionObserver = ref(null);
const sectionTimers = ref({});

onMounted(() => {
    matomo.initPageTracking('landing', 'anonymous');
    matomo.trackLandingPage();

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

    const sectionOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    sectionObserver.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName) {
                if (entry.isIntersecting) {
                    trackSectionView(sectionName);
                    sectionTimers.value[sectionName] = Date.now();
                } else if (sectionTimers.value[sectionName]) {
                    const timeSpent = Date.now() - sectionTimers.value[sectionName];
                    trackTimeSpent(sectionName, Math.round(timeSpent / 1000));
                    delete sectionTimers.value[sectionName];
                }
            }
        });
    }, sectionOptions);

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

    document.querySelectorAll('[data-section]').forEach((el) => {
        sectionObserver.value.observe(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.gameplay-feature').forEach((el) => {
            featureObserver.value.observe(el);
        });
    }, 100);

    let scrollTimeout;
    const handleScroll = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        showBackToTop.value = window.scrollY > 500;
        
        if (scrollPercent >= 25 && !window.scrollTracked25) {
            matomo.trackEngagement('scroll_depth', '25%');
            window.scrollTracked25 = true;
        } else if (scrollPercent >= 50 && !window.scrollTracked50) {
            matomo.trackEngagement('scroll_depth', '50%');
            window.scrollTracked50 = true;
        } else if (scrollPercent >= 75 && !window.scrollTracked75) {
            matomo.trackEngagement('scroll_depth', '75%');
            window.scrollTracked75 = true;
        } else if (scrollPercent >= 90 && !window.scrollTracked90) {
            matomo.trackEngagement('scroll_depth', '90%');
            window.scrollTracked90 = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            matomo.trackEngagement('scroll_position', scrollPercent);
        }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const startTime = Date.now();
    const trackTimeOnPage = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        matomo.trackEngagement('time_on_page', timeSpent);
    };

    const timeTrackingIntervals = [
        setTimeout(() => {
            matomo.trackEngagement('time_milestone', '30s');
        }, 30000),
        setTimeout(() => {
            matomo.trackEngagement('time_milestone', '60s');
        }, 60000),
        setTimeout(() => {
            matomo.trackEngagement('time_milestone', '120s');
        }, 120000),
        setTimeout(() => {
            matomo.trackEngagement('time_milestone', '300s');
        }, 300000),
    ];

    const handleBeforeUnload = () => {
        trackTimeOnPage();
        timeTrackingIntervals.forEach(clearTimeout);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    let inactiveTimer;
    const resetInactiveTimer = () => {
        clearTimeout(inactiveTimer);
        inactiveTimer = setTimeout(() => {
            matomo.trackEngagement('user_inactive', '30s');
        }, 30000);
    };

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactiveTimer, { passive: true });
    });

    resetInactiveTimer();

    matomo.trackEvent('Technical', 'Screen_Resolution', `${window.screen.width}x${window.screen.height}`);
    matomo.trackEvent('Technical', 'Viewport_Size', `${window.innerWidth}x${window.innerHeight}`);
    matomo.trackEvent('Technical', 'Device_Pixel_Ratio', window.devicePixelRatio.toString());
    matomo.trackEvent('Technical', 'Color_Depth', window.screen.colorDepth.toString());
    matomo.trackEvent('Technical', 'Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    matomo.trackEvent('Technical', 'Language', navigator.language);

    if ('connection' in navigator) {
        const conn = navigator.connection;
        matomo.trackEvent('Technical', 'Connection_Type', conn.effectiveType || 'unknown');
        matomo.trackEvent('Technical', 'Connection_Downlink', conn.downlink?.toString() || 'unknown');
    }

    setTimeout(() => {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            matomo.trackEvent('Performance', 'Page_Load_Time', loadTime.toString());
            matomo.trackEvent('Performance', 'DOM_Ready_Time', domReady.toString());
        }
    }, 1000);
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
    if (sectionObserver.value) {
        sectionObserver.value.disconnect();
    }

    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('beforeunload', handleBeforeUnload);

    const finalTime = Math.round((Date.now() - startTime) / 1000);
    matomo.trackEngagement('final_time_on_page', finalTime);
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

.pixelated {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.gameplay-section-container {
    position: relative;
}

.gameplay-feature {
    min-height: 400px;
    margin-bottom: 2rem;
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}

.tg-btn-1 {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #feae34 0%, #fbdf6b 100%);
    color: #000;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.tg-btn-1:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(254, 174, 52, 0.4);
    background: linear-gradient(135deg, #fbdf6b 0%, #feae34 100%);
}

.tg-btn-1:active {
    transform: translateY(0);
}

.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}

.group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
}

.group:hover .group-hover\:w-2 {
    width: 0.5rem;
}

.testimonial-card {
    transition: all 0.3s ease;
}

.testimonial-card:hover {
    transform: rotate(0deg) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.faq-item {
    transition: all 0.3s ease;
}

.faq-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.stat-item {
    transition: all 0.3s ease;
}

.stat-item:hover {
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .particle {
        display: none;
    }
    
    .tg-btn-1 {
        padding: 10px 20px;
        font-size: 14px;
    }
}
</style>