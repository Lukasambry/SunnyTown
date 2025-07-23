import type { App } from 'vue';

export interface MatomoOptions {
  host: string;
  siteId: number;
  router?: any;
  enableLinkTracking?: boolean;
  requireConsent?: boolean;
  trackInitialView?: boolean;
  disableCookies?: boolean;
  requireCookieConsent?: boolean;
}

declare global {
  interface Window {
    _paq: any[];
  }
}

export default {
  install(app: App, options: MatomoOptions) {
    window._paq = window._paq || [];
    
    if (options.disableCookies) {
      window._paq.push(['disableCookies']);
    }
    
    if (options.enableLinkTracking !== false) {
      window._paq.push(['enableLinkTracking']);
    }
    
    if (options.requireConsent) {
      window._paq.push(['requireConsent']);
    }
    
    if (options.requireCookieConsent) {
      window._paq.push(['requireCookieConsent']);
    }
    
    window._paq.push(['setTrackerUrl', options.host + 'matomo.php']);
    window._paq.push(['setSiteId', options.siteId]);
    
    
    const script = document.createElement('script');
    script.async = true;
    script.src = options.host + 'matomo.js';
    document.head.appendChild(script);
    
    
    if (options.trackInitialView !== false) {
      window._paq.push(['trackPageView']);
    }
    
    console.log('🔍 Matomo initialized:', {
      host: options.host,
      siteId: options.siteId,
      trackInitialView: options.trackInitialView !== false
    });
    
    
    app.config.globalProperties.$matomo = {
      trackEvent: (category: string, action: string, name?: string, value?: number) => {
        window._paq.push(['trackEvent', category, action, name, value]);
      },
      trackPageView: (customTitle?: string) => {
        if (customTitle) {
          window._paq.push(['setDocumentTitle', customTitle]);
        }
        window._paq.push(['trackPageView']);
      },
      trackGoal: (goalId: number, value?: number) => {
        window._paq.push(['trackGoal', goalId, value]);
      }
    };
  }
};