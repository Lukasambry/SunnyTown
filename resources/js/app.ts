import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { ZiggyVue } from 'ziggy-js';
import { initializeTheme } from './composables/useAppearance';
import VueMatomo from 'vue-matomo';

declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        readonly VITE_MATOMO_HOST: string;
        readonly VITE_MATOMO_SITE_ID: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue);

        if (import.meta.env.VITE_MATOMO_HOST && import.meta.env.VITE_MATOMO_SITE_ID) {
            app.use(VueMatomo, {
                host: import.meta.env.VITE_MATOMO_HOST,
                siteId: parseInt(import.meta.env.VITE_MATOMO_SITE_ID),
                trackerFileName: 'matomo',
                enableHeartBeatTimer: true,
                heartBeatTimerInterval: 15,
                debug: import.meta.env.DEV,
            });
        }

        app.mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();