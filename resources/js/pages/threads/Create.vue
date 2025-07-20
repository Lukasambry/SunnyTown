<script lang="ts" setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { onMounted, onUnmounted, ref } from 'vue';
import { useMatomo, MATOMO_GOALS } from '../../composables/useMatomo';

interface Category {
    id: number;
    name: string;
}

const props = defineProps<{
    category: Category;
}>();

const matomo = useMatomo();
const formSubmitted = ref(false);
const formErrors = ref<string[]>([]);
const startTime = ref<number>(0);
const titleLength = ref(0);
const contentLength = ref(0);

const form = useForm({
    title: '',
    content: '',
});

const trackFormInteraction = (field: string) => {
    matomo.trackEvent('Form', 'Focus', `thread_create_${field}`);
    matomo.trackUserAction('Form_Interaction', 'thread_create', field);
};

const trackFormValidation = (field: string, isValid: boolean, errorType?: string) => {
    matomo.trackEvent('Form', 'Validation', `thread_create_${field}_${isValid ? 'valid' : 'invalid'}`);
    if (!isValid && errorType) {
        matomo.trackEvent('Form', 'Validation_Error', `thread_create_${field}_${errorType}`);
    }
};

const trackContentLength = (field: string, length: number) => {
    const milestones = [10, 50, 100, 200, 500];
    milestones.forEach(milestone => {
        if (length === milestone) {
            matomo.trackEvent('Form', 'Content_Length', `${field}_${milestone}_chars`);
        }
    });
};

const trackTypingBehavior = (field: string) => {
    matomo.trackEvent('Form', 'Typing', `thread_create_${field}`);
    matomo.trackEngagement('Typing_Activity', field);
};

function submit() {
    formSubmitted.value = true;
    formErrors.value = [];
    
    matomo.trackEvent('Form', 'Submit_Attempt', 'thread_create');
    
    const errors: string[] = [];
    
    if (!form.title.trim()) {
        errors.push('title_required');
        trackFormValidation('title', false, 'required');
    } else if (form.title.trim().length < 5) {
        errors.push('title_too_short');
        trackFormValidation('title', false, 'too_short');
    } else if (form.title.trim().length > 140) {
        errors.push('title_too_long');
        trackFormValidation('title', false, 'too_long');
    } else {
        trackFormValidation('title', true);
    }
    
    if (!form.content.trim()) {
        errors.push('content_required');
        trackFormValidation('content', false, 'required');
    } else if (form.content.trim().length < 10) {
        errors.push('content_too_short');
        trackFormValidation('content', false, 'too_short');
    } else {
        trackFormValidation('content', true);
    }
    
    if (errors.length > 0) {
        formErrors.value = errors;
        matomo.trackFormSubmission('thread_create', false, errors.join(','));
        formSubmitted.value = false;
        return;
    }
    
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    matomo.trackEvent('Form', 'Time_To_Submit', 'thread_create', timeSpent);
    
    form.post(route('forums.threads.store', props.category.id), {
        onSuccess: () => {
            matomo.trackFormSubmission('thread_create', true);
            matomo.trackGoal(MATOMO_GOALS.FORUM_THREAD_CREATE);
            matomo.trackEvent('Forum', 'Thread_Created', props.category.name);
            matomo.trackUserAction('Create_Success', 'forum_thread', props.category.name);
            
            matomo.trackEvent('Forum', 'Thread_Content_Length', 'title', form.title.length);
            matomo.trackEvent('Forum', 'Thread_Content_Length', 'content', form.content.length);
            
            const engagementScore = calculateEngagementScore();
            matomo.trackEvent('Forum', 'Engagement_Score', 'thread_create', engagementScore);
        },
        onError: (errors) => {
            const errorTypes = Object.keys(errors);
            matomo.trackFormSubmission('thread_create', false, errorTypes.join(','));
            
            errorTypes.forEach(field => {
                if (errors[field]) {
                    matomo.trackError('Thread_Create_Error', field, errors[field]);
                }
            });
            
            matomo.trackEvent('Forum', 'Thread_Create_Failed', errorTypes.join(','));
        },
        onFinish: () => {
            formSubmitted.value = false;
        }
    });
}

const calculateEngagementScore = () => {
    let score = 0;
    
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    score += Math.min(30, timeSpent / 10);
    
    score += Math.min(20, form.title.length / 7);
    score += Math.min(20, form.content.length / 25);
    
    if (form.title.trim()) score += 15;
    if (form.content.trim()) score += 15;
    
    return Math.round(score);
};

const trackBackToCategory = () => {
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    matomo.trackEvent('Forum', 'Abandon_Thread_Create', props.category.name, timeSpent);
    matomo.trackNavigation(`back_to_category_${props.category.id}`);
    matomo.trackUserAction('Abandon', 'thread_create', `time_${timeSpent}s`);
};

onMounted(() => {
    startTime.value = Date.now();
    
    matomo.trackForumPage('thread_create', props.category.name);
    matomo.initPageTracking('Forum', 'User');
    
    matomo.trackEvent('Forum', 'Thread_Create_Start', props.category.name);
    matomo.setCustomVariable(5, 'Thread_Category', props.category.name, 'page');
    
    const referrer = document.referrer;
    if (referrer && referrer.includes('categories')) {
        matomo.trackEvent('Forum', 'Create_Entry', 'from_category');
    } else if (referrer && referrer.includes('forum')) {
        matomo.trackEvent('Forum', 'Create_Entry', 'from_forum_index');
    } else {
        matomo.trackEvent('Forum', 'Create_Entry', 'direct');
    }
});

onUnmounted(() => {
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    matomo.trackEvent('Forum', 'Thread_Create_Session_End', 'time_spent', timeSpent);
    
    const completionState = form.title.trim() || form.content.trim() ? 'partially_filled' : 'empty';
    matomo.trackEvent('Forum', 'Form_State_On_Exit', completionState);
});
</script>

<template>
    <Head>
        <title>Créer un thread dans {{ props.category.name }}</title>
    </Head>

    <div class="container mx-auto space-y-6 px-4 py-6">
        <div class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt flex items-center justify-between px-4 py-2">
            <h1 class="font-mono text-2xl">Nouveau thread dans « {{ props.category.name }} »</h1>
            <Link 
                :href="route('forums.categories.show', { category: props.category.id })" 
                class="font-mono text-black hover:underline"
                @click="trackBackToCategory"
            >
                ← Retour
            </Link>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <label class="mb-1 block font-mono font-semibold">Titre</label>
                <input
                    v-model="form.title"
                    type="text"
                    placeholder="Entrez un titre…"
                    maxlength="140"
                    class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt w-full px-3 py-2 font-mono"
                    :class="{ 'pixel-border-destructive': form.errors.title || formErrors.includes('title_required') || formErrors.includes('title_too_short') || formErrors.includes('title_too_long') }"
                    @focus="trackFormInteraction('title')"
                    @input="titleLength = form.title.length; trackContentLength('title', titleLength); trackTypingBehavior('title')"
                    @blur="trackFormValidation('title', !!form.title.trim() && form.title.trim().length >= 5 && form.title.trim().length <= 140)"
                />
                <div class="mt-1 flex justify-between text-xs text-gray-600">
                    <span v-if="form.errors.title || formErrors.length > 0" class="text-red-600 font-mono">
                        {{ 
                            form.errors.title || 
                            (formErrors.includes('title_required') ? 'Titre requis' : 
                             formErrors.includes('title_too_short') ? 'Titre trop court (min. 5 caractères)' : 
                             'Titre trop long (max. 140 caractères)')
                        }}
                    </span>
                    <span class="font-mono">{{ titleLength }}/140</span>
                </div>
            </div>

            <div>
                <label class="mb-1 block font-mono font-semibold">Contenu</label>
                <textarea
                    v-model="form.content"
                    rows="6"
                    placeholder="Écrivez votre message…"
                    class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt w-full resize-none px-3 py-2 font-mono"
                    :class="{ 'pixel-border-destructive': form.errors.content || formErrors.includes('content_required') || formErrors.includes('content_too_short') }"
                    @focus="trackFormInteraction('content')"
                    @input="contentLength = form.content.length; trackContentLength('content', contentLength); trackTypingBehavior('content')"
                    @blur="trackFormValidation('content', !!form.content.trim() && form.content.trim().length >= 10)"
                ></textarea>
                <div class="mt-1 flex justify-between text-xs text-gray-600">
                    <span v-if="form.errors.content || formErrors.includes('content_required') || formErrors.includes('content_too_short')" class="text-red-600 font-mono">
                        {{ 
                            form.errors.content || 
                            (formErrors.includes('content_required') ? 'Contenu requis' : 'Contenu trop court (min. 10 caractères)')
                        }}
                    </span>
                    <span class="font-mono">{{ contentLength }} caractères</span>
                </div>
            </div>

            <button
                type="submit"
                :disabled="form.processing || formSubmitted"
                class="pixel-border pixel-border-gold px-4 py-2 font-mono text-black disabled:opacity-50"
                :class="{ 'animate-pulse': form.processing }"
            >
                <span v-if="form.processing">Création en cours…</span>
                <span v-else>Créer le thread</span>
            </button>
        </form>
    </div>
</template>