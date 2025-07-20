<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { getInitials } from '@/composables/useInitials';
import { useMatomo } from '@/composables/useMatomo';
import type { BreadcrumbItem, NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth as { user: { id: number; name: string; avatar?: string } });
const matomo = useMatomo();

const isCurrentRoute = computed(() => (url: string) => page.url === url);

const activeItemStyles = computed(
    () => (url: string) => (isCurrentRoute.value(url) ? 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100' : ''),
);

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];

// Matomo tracking functions
const trackMainNavClick = (item: NavItem) => {
    matomo.trackNavigation(`main_nav_${item.title.toLowerCase()}`);
    matomo.trackEvent('Header', 'Navigation', item.title);
};

const trackRightNavClick = (item: NavItem) => {
    matomo.trackNavigation(`external_link_${item.title.toLowerCase()}`);
    matomo.trackEvent('Header', 'External_Link', item.title);
};

const trackMobileMenuOpen = () => {
    matomo.trackEvent('Header', 'Mobile_Menu', 'open');
    matomo.trackEngagement('Mobile_Menu', 'open');
};

const trackSearchClick = () => {
    matomo.trackEvent('Header', 'Search', 'click');
    matomo.trackUserAction('Search', 'header');
};

const trackLogoClick = () => {
    matomo.trackEvent('Header', 'Logo', 'click');
    matomo.trackNavigation('logo_home');
};

const trackUserMenuOpen = () => {
    matomo.trackEvent('Header', 'User_Menu', 'open');
    matomo.trackEngagement('User_Menu', 'open');
};

const trackBreadcrumbClick = (breadcrumb: BreadcrumbItem, index: number) => {
    matomo.trackEvent('Header', 'Breadcrumb', `${breadcrumb.title}_level_${index}`);
    matomo.trackNavigation(`breadcrumb_${breadcrumb.title.toLowerCase()}`);
};

onMounted(() => {
    // Track header load and user status
    const userStatus = auth.value?.user ? 'authenticated' : 'guest';
    matomo.trackEvent('Header', 'Load', userStatus);
    
    if (auth.value?.user) {
        matomo.setUserId(auth.value.user.id.toString());
        matomo.setCustomVariable(2, 'User Status', 'Authenticated', 'visit');
    }
});
</script>

<template>
    <div>
        <div class="border-sidebar-border/80 border-b">
            <div class="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                <!-- Mobile Menu -->
                <div class="lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button variant="ghost" size="icon" class="mr-2 h-9 w-9" @click="trackMobileMenuOpen">
                                <Menu class="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-[300px] p-6">
                            <SheetTitle class="sr-only">Navigation Menu</SheetTitle>
                            <SheetHeader class="flex justify-start text-left">
                                <AppLogoIcon class="size-6 fill-current text-black dark:text-white" />
                            </SheetHeader>
                            <div class="flex h-full flex-1 flex-col justify-between space-y-4 py-6">
                                <nav class="-mx-3 space-y-1">
                                    <Link
                                        v-for="item in mainNavItems"
                                        :key="item.title"
                                        :href="item.href"
                                        class="hover:bg-accent flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium"
                                        :class="activeItemStyles(item.href)"
                                        @click="trackMainNavClick(item)"
                                    >
                                        <component v-if="item.icon" :is="item.icon" class="h-5 w-5" />
                                        {{ item.title }}
                                    </Link>
                                </nav>
                                <div class="flex flex-col space-y-4">
                                    <a
                                        v-for="item in rightNavItems"
                                        :key="item.title"
                                        :href="item.href"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center space-x-2 text-sm font-medium"
                                        @click="trackRightNavClick(item)"
                                    >
                                        <component v-if="item.icon" :is="item.icon" class="h-5 w-5" />
                                        <span>{{ item.title }}</span>
                                    </a>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link :href="route('dashboard')" class="flex items-center gap-x-2" @click="trackLogoClick">
                    <AppLogo />
                </Link>

                <!-- Desktop Menu -->
                <div class="hidden h-full lg:flex lg:flex-1">
                    <NavigationMenu class="ml-10 flex h-full items-stretch">
                        <NavigationMenuList class="flex h-full items-stretch space-x-2">
                            <NavigationMenuItem v-for="(item, index) in mainNavItems" :key="index" class="relative flex h-full items-center">
                                <Link :href="item.href" @click="trackMainNavClick(item)">
                                    <NavigationMenuLink
                                        :class="[navigationMenuTriggerStyle(), activeItemStyles(item.href), 'h-9 cursor-pointer px-3']"
                                    >
                                        <component v-if="item.icon" :is="item.icon" class="mr-2 h-4 w-4" />
                                        {{ item.title }}
                                    </NavigationMenuLink>
                                </Link>
                                <div
                                    v-if="isCurrentRoute(item.href)"
                                    class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"
                                ></div>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div class="ml-auto flex items-center space-x-2">
                    <div class="relative flex items-center space-x-1">
                        <Button variant="ghost" size="icon" class="group h-9 w-9 cursor-pointer" @click="trackSearchClick">
                            <Search class="size-5 opacity-80 group-hover:opacity-100" />
                        </Button>

                        <div class="hidden space-x-1 lg:flex">
                            <template v-for="item in rightNavItems" :key="item.title">
                                <TooltipProvider :delay-duration="0">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button variant="ghost" size="icon" as-child class="group h-9 w-9 cursor-pointer">
                                                <a :href="item.href" target="_blank" rel="noopener noreferrer" @click="trackRightNavClick(item)">
                                                    <span class="sr-only">{{ item.title }}</span>
                                                    <component :is="item.icon" class="size-5 opacity-80 group-hover:opacity-100" />
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{{ item.title }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </template>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="focus-within:ring-primary relative size-10 w-auto rounded-full p-1 focus-within:ring-2"
                                @click="trackUserMenuOpen"
                            >
                                <Avatar class="size-8 overflow-hidden rounded-full">
                                    <AvatarImage v-if="auth.user.avatar" :src="auth.user.avatar" :alt="auth.user.name" />
                                    <AvatarFallback class="rounded-lg bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white">
                                        {{ getInitials(auth.user?.name) }}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <UserMenuContent :user="auth.user" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>

        <div v-if="props.breadcrumbs.length > 1" class="border-sidebar-border/70 flex w-full border-b">
            <div class="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                <Breadcrumbs :breadcrumbs="breadcrumbs" @breadcrumb-click="trackBreadcrumbClick" />
            </div>
        </div>
    </div>
</template>