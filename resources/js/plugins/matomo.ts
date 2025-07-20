import type { App } from 'vue'
import { useMatomo } from '@/composables/useMatomo'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $matomo: ReturnType<typeof useMatomo>
    }
}

export default {
    install(app: App) {
        const matomo = useMatomo()
        
        app.config.globalProperties.$matomo = matomo
        
        app.provide('matomo', matomo)
        
        matomo.init()
    }
}