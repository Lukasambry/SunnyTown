<template>
    <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-8">
                <a 
                    href="/" 
                    @click="handleNavigationClick('home')"
                    class="text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:text-blue-400"
                >
                    ACCUEIL
                </a>
                <a 
                    href="/game" 
                    @click="handleNavigationClick('game')"
                    class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                    JEU
                </a>
                <a 
                    href="/forum" 
                    @click="handleNavigationClick('forum')"
                    class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                    FORUM
                </a>
                <a 
                    href="/blog" 
                    @click="handleNavigationClick('blog')"
                    class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                    BLOG
                </a>
                <a
                    v-if="userHasAdminRole"
                    href="/admin"
                    @click="handleNavigationClick('admin')"
                    class="text-gray-300 transition-all duration-300 hover:scale-105 hover:text-red-400 font-semibold"
                >
                    ADMIN
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <a 
                    href="https://twitter.com/sunnytown" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Twitter"
                    @click="handleSocialClick('twitter')"
                >
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.07 7.1V8c-4.09-.07-7.72-2.17-10.13-5.1A4.48 4.48 0 002 9.5a4.65 4.65 0 01-2-.54v.05A4.48 4.48 0 004.5 13a4.49 4.49 0 01-2 .08A4.51 4.51 0 006 15c-3.54 2.8-7.6 1.6-7.6 1.6" />
                        </svg>
                    </div>
                </a>
                <a 
                    href="https://facebook.com/sunnytown" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook"
                    @click="handleSocialClick('facebook')"
                >
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:bg-blue-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.28l.72-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </div>
                </a>
                <a 
                    href="https://discord.gg/sunnytown" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Discord"
                    @click="handleSocialClick('discord', MATOMO_GOALS.DISCORD_JOIN)"
                >
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-600/20">
                        <svg class="h-5 w-5 text-gray-400 hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                        </svg>
                    </div>
                </a>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useMatomo, MATOMO_GOALS } from '@/composables/useMatomo'

const page = usePage()
const user = computed(() => page.props.auth.user || {})
const matomo = useMatomo()

const userHasAdminRole = computed(() =>
    user.value?.roles?.some(role => role.name === 'admin')
)

onMounted(() => {
    if (user.value?.id) {
        matomo.setUserId(user.value.id.toString())
        matomo.setCustomVariable(1, 'User Status', 'authenticated', 'visit')
        matomo.setCustomVariable(2, 'User Role', userHasAdminRole.value ? 'admin' : 'user', 'visit')
    } else {
        matomo.setCustomVariable(1, 'User Status', 'guest', 'visit')
    }
    
    matomo.trackEvent('Navigation', 'View', 'navbar')
    console.log('🔍 Matomo: Navbar tracking initialized')
})

const handleNavigationClick = (section: string) => {
    matomo.trackNavigation(section)
    
    switch (section) {
        case 'game':
            matomo.trackEvent('Navigation', 'Click', 'play_game')
            break
        case 'admin':
            matomo.trackEvent('Navigation', 'Click', 'admin_access')
            break
        default:
            matomo.trackEvent('Navigation', 'Click', section)
    }
}

const handleSocialClick = (platform: string, goalId?: number) => {
    matomo.trackEvent('Social', 'Click', platform)
    matomo.trackUserAction('external_link', platform)
    
    if (goalId) {
        matomo.trackGoal(goalId)
    }
    
    matomo.trackEngagement('social_interaction', platform)
    
    console.log(`🔍 Matomo: Social click tracked for ${platform}`)
}
</script>