import { onMounted, onUnmounted } from 'vue';

export const MATOMO_GOALS = {
    PLAY_NOW: 1,
    REGISTER_SUCCESS: 2,
    LOGIN_SUCCESS: 3,
    FORUM_THREAD_CREATE: 4,
    BLOG_ARTICLE_CREATE: 5,
    DISCORD_JOIN: 6,
    FORUM_MESSAGE_CREATE: 7,
} as const;

export interface MatomoTracker {
    trackPageView: (customTitle?: string) => void;
    trackEvent: (category: string, action: string, name?: string, value?: number) => void;
    trackGoal: (idGoal: number, customRevenue?: number) => void;
    setUserId: (userId: string) => void;
    setCustomVariable: (index: number, name: string, value: string, scope?: string) => void;
    deleteCustomVariable: (index: number, scope?: string) => void;
    setDocumentTitle: (title: string) => void;
    setReferrerUrl: (url: string) => void;
    setCustomUrl: (url: string) => void;
    enableHeartBeatTimer: (activeTimeInseconds?: number) => void;
    disableHeartBeatTimer: () => void;
    
    trackLandingPage: () => void;
    trackForumPage: (pageType: string, category?: string, thread?: string) => void;
    trackBlogPage: (pageType: string, articleTitle?: string) => void;
    trackAuthPage: (pageType: 'login' | 'register') => void;
    trackNavigation: (section: string) => void;
    trackCTA: (action: string, goalId?: number) => void;
    trackFormSubmission: (formType: string, success: boolean, errorType?: string) => void;
    trackUserAction: (action: string, context: string, value?: string | number) => void;
    trackEngagement: (type: string, value: string | number) => void;
    trackError: (errorType: string, context: string, details?: string) => void;
    initPageTracking: (pageType: string, userStatus: string) => void;
}

export function useMatomo(): MatomoTracker {
    const trackPageView = (customTitle?: string) => {
        if (typeof window !== 'undefined' && window._paq) {
            if (customTitle) {
                window._paq.push(['setDocumentTitle', customTitle]);
            }
            window._paq.push(['trackPageView']);
            console.log('🔍 Matomo: Page view tracked', customTitle || 'Default');
        }
    };

    const trackEvent = (category: string, action: string, name?: string, value?: number) => {
    if (typeof window !== 'undefined' && window._paq) {
        const eventData: (string | number)[] = ['trackEvent', category, action];
        if (name) eventData.push(name);
        if (value !== undefined && !isNaN(value) && isFinite(value)) {
            eventData.push(value);
        }
        
        window._paq.push(eventData);
        console.log('🔍 Matomo: Event tracked', { category, action, name, value: value ?? 'not provided' });
    }
};

    const trackGoal = (idGoal: number, customRevenue?: number) => {
        if (typeof window !== 'undefined' && window._paq) {
            const goalData = ['trackGoal', idGoal];
            if (customRevenue !== undefined) goalData.push(customRevenue);
            
            window._paq.push(goalData);
            console.log('🔍 Matomo: Goal tracked', { idGoal, customRevenue });
        }
    };

    const setUserId = (userId: string) => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['setUserId', userId]);
            console.log('🔍 Matomo: User ID set', userId);
        }
    };

    const setCustomVariable = (index: number, name: string, value: string, scope: string = 'visit') => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['setCustomVariable', index, name, value, scope]);
            console.log('🔍 Matomo: Custom variable set', { index, name, value, scope });
        }
    };

    const deleteCustomVariable = (index: number, scope: string = 'visit') => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['deleteCustomVariable', index, scope]);
            console.log('🔍 Matomo: Custom variable deleted', { index, scope });
        }
    };

    const setDocumentTitle = (title: string) => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['setDocumentTitle', title]);
        }
    };

    const setReferrerUrl = (url: string) => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['setReferrerUrl', url]);
        }
    };

    const setCustomUrl = (url: string) => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['setCustomUrl', url]);
        }
    };

    const enableHeartBeatTimer = (activeTimeInseconds: number = 15) => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['enableHeartBeatTimer', activeTimeInseconds]);
        }
    };

    const disableHeartBeatTimer = () => {
        if (typeof window !== 'undefined' && window._paq) {
            window._paq.push(['disableHeartBeatTimer']);
        }
    };

    // Méthodes spécialisées
    const trackLandingPage = () => {
        trackPageView('SunnyTown - Landing Page');
        setCustomVariable(1, 'Page Type', 'Landing', 'page');
        trackEvent('Technical', 'Load', 'landing_page');
    };

    const trackForumPage = (pageType: string, category?: string, thread?: string) => {
        let title = `Forum - ${pageType}`;
        if (category) title += ` - ${category}`;
        if (thread) title += ` - ${thread}`;
        
        trackPageView(title);
        setCustomVariable(1, 'Page Type', 'Forum', 'page');
        setCustomVariable(2, 'Forum Section', pageType, 'page');
        
        if (category) {
            trackEvent('Forum', 'View', `category_${category}`);
        }
        if (thread) {
            trackEvent('Forum', 'View', `thread_${thread}`);
        }
    };

    const trackBlogPage = (pageType: string, articleTitle?: string) => {
        let title = `Blog - ${pageType}`;
        if (articleTitle) title += ` - ${articleTitle}`;
        
        trackPageView(title);
        setCustomVariable(1, 'Page Type', 'Blog', 'page');
        setCustomVariable(2, 'Blog Section', pageType, 'page');
        
        if (pageType === 'article' && articleTitle) {
            trackEvent('Blog', 'Read', articleTitle);
        }
    };

    const trackAuthPage = (pageType: 'login' | 'register') => {
        trackPageView(`Auth - ${pageType}`);
        setCustomVariable(1, 'Page Type', 'Auth', 'page');
        setCustomVariable(2, 'Auth Type', pageType, 'page');
        trackEvent('Auth', 'View', pageType);
    };

    const trackNavigation = (section: string) => {
        trackEvent('Navigation', 'Click', section);
    };

    const trackCTA = (action: string, goalId?: number) => {
        trackEvent('CTA', 'Click', action);
        if (goalId) {
            trackGoal(goalId);
        }
    };

    const trackFormSubmission = (formType: string, success: boolean, errorType?: string) => {
        if (success) {
            trackEvent('Form', 'Submit_Success', formType);
            
            if (formType === 'register') {
                trackGoal(MATOMO_GOALS.REGISTER_SUCCESS);
            } else if (formType === 'login') {
                trackGoal(MATOMO_GOALS.LOGIN_SUCCESS);
            } else if (formType === 'thread_create') {
                trackGoal(MATOMO_GOALS.FORUM_THREAD_CREATE);
            } else if (formType === 'blog_create') {
                trackGoal(MATOMO_GOALS.BLOG_ARTICLE_CREATE);
            } else if (formType === 'message_create') {
                trackGoal(MATOMO_GOALS.FORUM_MESSAGE_CREATE);
            }
        } else {
            trackEvent('Form', 'Submit_Error', formType);
            if (errorType) {
                trackEvent('Form', 'Error_Type', `${formType}_${errorType}`);
            }
        }
    };

    const trackUserAction = (action: string, context: string, value?: string | number) => {
        trackEvent('User', action, context, typeof value === 'number' ? value : undefined);
        if (typeof value === 'string') {
            trackEvent('User', action, `${context}_${value}`);
        }
    };

    const trackEngagement = (type: string, value: string | number) => {
        trackEvent('Engagement', type, undefined, typeof value === 'number' ? value : undefined);
        if (typeof value === 'string') {
            trackEvent('Engagement', type, value);
        }
    };

    const trackError = (errorType: string, context: string, details?: string) => {
        trackEvent('Error', errorType, context);
        if (details) {
            trackEvent('Error', 'Details', `${context}_${details}`);
        }
    };

    const initPageTracking = (pageType: string, userStatus: string) => {
        setCustomVariable(1, 'Page Type', pageType, 'page');
        setCustomVariable(2, 'User Status', userStatus, 'visit');
        setCustomVariable(3, 'Device Type', window.innerWidth > 768 ? 'Desktop' : 'Mobile', 'page');
        setCustomVariable(4, 'Session Type', document.referrer ? 'Referral' : 'Direct', 'visit');
        
        trackEvent('Technical', 'Viewport', window.innerWidth > 768 ? 'Desktop' : 'Mobile');
        trackEvent('Technical', 'User_Agent', navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop');
    };

    return {
        trackPageView,
        trackEvent,
        trackGoal,
        setUserId,
        setCustomVariable,
        deleteCustomVariable,
        setDocumentTitle,
        setReferrerUrl,
        setCustomUrl,
        enableHeartBeatTimer,
        disableHeartBeatTimer,
        trackLandingPage,
        trackForumPage,
        trackBlogPage,
        trackAuthPage,
        trackNavigation,
        trackCTA,
        trackFormSubmission,
        trackUserAction,
        trackEngagement,
        trackError,
        initPageTracking,
    };
}

declare global {
    interface Window {
        _paq: any[];
    }
}