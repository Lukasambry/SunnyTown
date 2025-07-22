<template>
    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black">
        <div class="fixed inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-[''] pointer-events-none"></div>

        <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 tracking-tight bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5">
            <div class="px-6">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-6">
                        <Link
                            :href="route('home')"
                            class="text-xl font-bold text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors flex items-center gap-3"
                            aria-label="Home"
                        >
                            SunnyTown.
                        </Link>
                        <span class="text-black/30 dark:text-white/30">/</span>

                        <nav class="hidden md:flex items-center gap-6 uppercase">
                            <Link
                                :href="route('forums.index')"
                                class="text-sm font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                                :class="{ 'text-orange-500': isCurrentRoute('forums.index') }"
                            >
                                Forum
                            </Link>
                            <Link
                                :href="route('blog.index')"
                                class="text-sm font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                                :class="{ 'text-orange-500': isCurrentRoute('blog.index') }"
                            >
                                Blog
                            </Link>
                        </nav>
                    </div>

                    <div class="hidden md:flex items-center gap-3">
                        <button
                            @click="toggleTheme"
                            class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            aria-label="Toggle theme"
                        >
                            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2"/>
                                <path d="M12 20v2"/>
                                <path d="m4.93 4.93 1.41 1.41"/>
                                <path d="m17.66 17.66 1.41 1.41"/>
                                <path d="M2 12h2"/>
                                <path d="M20 12h2"/>
                                <path d="m6.34 17.66-1.41-1.41"/>
                                <path d="m19.07 4.93-1.41-1.41"/>
                            </svg>
                        </button>

                        <template v-if="!auth?.user">
                            <Link
                                :href="route('login')"
                                class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-8 sm:h-10 px-5 sm:px-6 text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                            >
                                Login
                            </Link>
                            <Link
                                :href="route('register')"
                                class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:bg-primary/90 h-7 sm:h-9 px-3 sm:px-4 text-white dark:text-black tracking-tight group dark:bg-white/95 bg-black rounded-lg dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                            >
                                Get Started
                            </Link>
                        </template>

                        <div v-else class="relative">
                            <button
                                @click="showUserMenu = !showUserMenu"
                                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
                                    {{ auth.user.name.charAt(0).toUpperCase() }}
                                </div>
                                <span class="text-sm font-medium text-black dark:text-white">{{ auth.user.name }}</span>
                            </button>

                            <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-sm">
                                <div class="py-2">
                                    <Link
                                        :href="route('game.index')"
                                        class="block px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Jouer au jeu
                                    </Link>
                                    <Link
                                        href="/admin"
                                        class="block px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <!--
                                    <Link
                                        :href="route('profile.edit')"
                                        class="block px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    -->
                                    <hr class="my-2 border-black/5 dark:border-white/5">
                                    <Link
                                        :href="route('logout')"
                                        method="post"
                                        as="button"
                                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex md:hidden items-center gap-2">
                        <button
                            @click="toggleTheme"
                            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 w-9 text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                            aria-label="Toggle theme"
                        >
                            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2"/>
                                <path d="M12 20v2"/>
                                <path d="m4.93 4.93 1.41 1.41"/>
                                <path d="m17.66 17.66 1.41 1.41"/>
                                <path d="M2 12h2"/>
                                <path d="M20 12h2"/>
                                <path d="m6.34 17.66-1.41-1.41"/>
                                <path d="m19.07 4.93-1.41-1.41"/>
                            </svg>
                        </button>
                        <button
                            @click="showMobileMenu = !showMobileMenu"
                            type="button"
                            class="p-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                                <path d="M4 12h16"/>
                                <path d="M4 18h16"/>
                                <path d="M4 6h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="showMobileMenu" class="md:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-md">
                <div class="px-6 py-4 space-y-3">
                    <Link
                        :href="route('forums.index')"
                        class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                        @click="showMobileMenu = false"
                    >
                        Forum
                    </Link>
                    <Link
                        :href="route('blog.index')"
                        class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                        @click="showMobileMenu = false"
                    >
                        Blog
                    </Link>
                    <a
                        href="#faq"
                        class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                        @click="scrollToFaq; showMobileMenu = false"
                    >
                        FAQ
                    </a>
                    <a
                        href="#contact"
                        class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                        @click="showMobileMenu = false"
                    >
                        Contact
                    </a>

                    <div v-if="!auth?.user" class="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
                        <Link
                            :href="route('login')"
                            class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                            @click="showMobileMenu = false"
                        >
                            Login
                        </Link>
                        <Link
                            :href="route('register')"
                            class="block py-2 text-base font-medium text-orange-600 hover:text-orange-700 transition-colors"
                            @click="showMobileMenu = false"
                        >
                            Get Started
                        </Link>
                    </div>

                    <div v-else class="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
                        <div class="flex items-center gap-3 py-2">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
                                {{ auth.user.name.charAt(0).toUpperCase() }}
                            </div>
                            <span class="text-base font-medium text-black dark:text-white">{{ auth.user.name }}</span>
                        </div>
                        <Link
                            :href="route('dashboard')"
                            class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                            @click="showMobileMenu = false"
                        >
                            Dashboard
                        </Link>
                        <Link
                            :href="route('profile.edit')"
                            class="block py-2 text-base font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors"
                            @click="showMobileMenu = false"
                        >
                            Profile
                        </Link>
                        <Link
                            :href="route('logout')"
                            method="post"
                            as="button"
                            class="block py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors"
                            @click="showMobileMenu = false"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </header>

        <main class="relative z-10 pt-16">
            <slot />
        </main>

        <!--
        <section id="faq" class="py-16 sm:py-24 bg-black/95 dark:bg-white/95 mx-2 sm:mx-4 mb-4 rounded-2xl overflow-hidden relative">
            <div class="absolute inset-0 overflow-hidden opacity-10">
                <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-white/30 to-white/5 dark:from-black/30 dark:to-black/5 blur-3xl"></div>
                <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-white/30 to-white/5 dark:from-black/30 dark:to-black/5 blur-3xl"></div>
            </div>
            <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div class="max-w-3xl mx-auto px-4 sm:px-6 relative">
                <div class="text-center space-y-4 mb-10">
                    <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white dark:text-black">FAQ.</h2>
                    <p class="text-sm sm:text-base tracking-tight text-white/60 dark:text-black/60 max-w-2xl mx-auto">Looking for answers? It's here.</p>
                </div>

                <div class="space-y-2.5">
                    <div
                        v-for="(faq, index) in faqs"
                        :key="index"
                        class="backdrop-blur-sm border border-white/10 dark:border-black/10 bg-white/[0.03] dark:bg-black/[0.03] rounded-lg overflow-hidden shadow-sm shadow-white/5 dark:shadow-black/5 hover:border-white/15 dark:hover:border-black/15 transition-colors"
                    >
                        <button
                            @click="toggleFaq(index)"
                            class="flex items-center justify-between w-full px-5 py-4 text-left"
                            :aria-expanded="openFaqs.has(index)"
                        >
                            <h3 class="text-base font-medium text-white dark:text-black">{{ faq.question }}</h3>
                            <div class="flex-shrink-0 ml-4 flex items-center justify-center h-6 w-6 rounded-full bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="h-3.5 w-3.5 text-white/80 dark:text-black/80 transition-transform duration-200"
                                    :class="{ 'rotate-45': openFaqs.has(index) }"
                                >
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                            </div>
                        </button>
                        <div
                            v-if="openFaqs.has(index)"
                            class="px-5 pb-4 text-sm text-white/70 dark:text-black/70 leading-relaxed"
                        >
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <h3 class="text-lg font-medium text-white dark:text-black mb-4">Can't find what you're looking for? Email us.</h3>
                    <div class="inline-block">
                        <a
                            href="mailto:support@Sunnytown.ai"
                            class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-xs h-9 px-5 bg-white dark:bg-black text-black dark:text-white rounded-lg border border-white/10 dark:border-black/10 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-200 group"
                        >
                            support@Sunnytown.ai
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        -->

        <footer class="sticky bottom-0 w-full mt-auto bg-white/95 dark:bg-black/95 border-t border-black/5 dark:border-white/5 backdrop-blur-md z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div class="flex-shrink-0 max-w-xs">
                        <Link
                            :href="route('home')"
                            class="text-4xl font-bold tracking-tighter text-black dark:text-white hover:opacity-90 transition-opacity flex items-center gap-3"
                        >
                            SunnyTown.
                        </Link>
                        <p class="mt-2 text-sm text-black/60 dark:text-white/60">Une expérience de construction de ville révolutionnaire.</p>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
                        <div class="space-y-3">
                            <h3 class="text-sm font-medium text-black dark:text-white">Communité</h3>
                            <ul class="space-y-2">
                                <li><Link :href="route('forums.index')" class="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Forum</Link></li>
                                <li><Link :href="route('blog.index')" class="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-sm font-medium text-black dark:text-white">Concept</h3>
                            <ul class="space-y-2">
                                <li><a :href="route('game.index')" class="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Le jeu</a></li>
                                <li><a :href="route('landing')" class="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Landing</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex-shrink-0 space-y-3 max-w-xs">
                        <h3 class="text-sm font-medium text-black dark:text-white">Restez à jour</h3>
                        <p class="text-sm text-black/60 dark:text-white/60">Abonnez-vous à notre newsletter pour les dernières mises à jour et fonctionnalités.</p>
                        <div class="mt-3 flex items-center gap-2">
                            <input
                                v-model="newsletterEmail"
                                type="email"
                                placeholder="Entrez votre email"
                                class="flex-1 px-3 py-2 text-sm rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 placeholder:text-black/40 dark:placeholder:text-white/40"
                            >
                            <button
                                @click="subscribeNewsletter"
                                class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm text-xs h-9 px-3 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                    <path d="M5 12h14"/>
                                    <path d="m12 5 7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-8 pt-5 border-t border-black/5 dark:border-white/5 text-xs text-black/50 dark:text-white/50">
                    <p>© 2025 Sunnytown. All rights reserved.</p>
                    <div class="flex gap-4 mt-2 sm:mt-0">
                        <a href="#terms" class="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                        <a href="#privacy" class="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#cookies" class="hover:text-black dark:hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { ref, computed, onMounted, onUnmounted } from 'vue';

defineProps<{
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}>();

const showMobileMenu = ref(false);
const showUserMenu = ref(false);
const isDark = ref(false);
const newsletterEmail = ref('');
//const openFaqs = ref(new Set());

const page = usePage();
/*
const faqs = ref([
    {
        question: "How do the AI-powered Sunnytown work?",
        answer: "Our AI-powered Sunnytown use advanced neural processing to enhance your visual experience. They feature real-time scene analysis, adaptive brightness control, and augmented visual information overlay that seamlessly integrates with your daily activities."
    },
    {
        question: "What's the battery life of the AI Sunnytown?",
        answer: "The AI Sunnytown offer an impressive 24-hour battery life without charging. The advanced power management system and efficient neural processing chips ensure all-day usage for work, entertainment, and daily tasks."
    },
    {
        question: "Can I customize the visual experience?",
        answer: "Absolutely! You can personalize your visual experience through our companion app. Adjust display settings, choose information overlays, set preferences for different environments, and configure voice commands to match your lifestyle."
    },
    {
        question: "What kind of visual enhancements do they provide?",
        answer: "The Sunnytown provide multiple enhancements including: 99% visual recognition accuracy, 10ms real-time response time, smart display with adaptive brightness, object identification, text-to-speech functionality, and seamless information overlay."
    },
    {
        question: "Are the AI Sunnytown secure?",
        answer: "Security is our top priority. All data processing happens locally on the device with end-to-end encryption. We don't store personal visual data on external servers, and you have complete control over what information is processed and shared."
    },
    {
        question: "Do you offer support for the AI Sunnytown?",
        answer: "Yes! We provide 24/7 premium support, free training sessions to help you get started, regular software updates with new features, and a comprehensive warranty program. Our dedicated team is always ready to assist you."
    }
]);
*/
const isCurrentRoute = computed(() => (routeName: string) => {
    return page.component?.startsWith(routeName) || page.url.includes(routeName);
});

const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

/*
const toggleFaq = (index: number) => {
    if (openFaqs.value.has(index)) {
        openFaqs.value.delete(index);
    } else {
        openFaqs.value.add(index);
    }
};
*/

const scrollToFaq = () => {
    const faqSection = document.getElementById('faq');
    if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
    }
};

const subscribeNewsletter = () => {
    if (newsletterEmail.value) {
        console.log('Subscribing email:', newsletterEmail.value);
        newsletterEmail.value = '';
        alert('Thank you for subscribing to our newsletter!');
    }
};

const handleClickOutside = (event: Event) => {
    const target = event.target as Element;
    if (!target.closest('.relative')) {
        showUserMenu.value = false;
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark.value);

    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

import { watch } from 'vue';
watch(() => page.url, () => {
    showMobileMenu.value = false;
});
</script>

<style scoped>
.rotate-45 {
    transform: rotate(45deg);
}

.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.space-y-3::-webkit-scrollbar {
    width: 4px;
}

.space-y-3::-webkit-scrollbar-track {
    background: transparent;
}

.space-y-3::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.dark .space-y-3::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
}

input:focus {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

a, button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-2\.5 > div {
    animation: fadeIn 0.3s ease-out;
}
</style>
