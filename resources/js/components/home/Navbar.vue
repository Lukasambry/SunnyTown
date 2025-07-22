<template>
    <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-8">
                <a href="/" class="text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:text-blue-400">
                    ACCUEIL
                </a>
                <a href="/game" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white">JEU</a>
                <a href="#community" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white">COMMUNAUTÉ</a>
                <a href="/forum" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white">FORUM</a>
                <a href="/blog" class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white">BLOG</a>
                <a
                    v-if="userHasAdminRole"
                    href="/admin"
                    class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-red-400 font-semibold"
                >
                    ADMIN
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.07 7.1V8c-4.09-.07-7.72-2.17-10.13-5.1A4.48 4.48 0 002 9.5a4.65 4.65 0 01-2-.54v.05A4.48 4.48 0 004.5 13a4.49 4.49 0 01-2 .08A4.51 4.51 0 006 15c-3.54 2.8-7.6 1.6-7.6 1.6" /></svg>
                    </div>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.28l.72-4h-4V7a1 1 0 011-1h3z" /></svg>
                    </div>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 20a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h7l2-2h6a1 1 0 011 1z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                    </div>
                </a>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3';

const page = usePage()
const user = computed(() => page.props.auth.user || {})


const userHasAdminRole = computed(() =>
    user.value?.roles?.some(role => role.name === 'admin')
)

</script>
