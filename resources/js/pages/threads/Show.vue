<template>
    <div class="space-y-6 p-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">{{ thread.title }}</h1>
            
            <!-- Thread metadata with real-time stats -->
            <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <span class="font-mono text-sm text-gray-600">
                        👁️ {{ realTimeStats.views }} vues
                    </span>
                    <span class="font-mono text-sm text-gray-600">
                        💬 {{ thread.messages.length }} messages
                    </span>
                    <span class="font-mono text-sm text-gray-600" v-if="realTimeStats.activeReaders > 0">
                        🟢 {{ realTimeStats.activeReaders }} en lecture
                    </span>
                </div>
                <div class="text-right">
                    <div class="font-mono text-xs text-gray-500">
                        Dernière activité: {{ lastActivityTime }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Messages with tracking -->
        <div 
    v-for="(msg, msgIndex) in thread.messages" 
    :key="msg.id"
    @click="trackMessageClick(msg, msgIndex)"
    @mouseenter="trackMessageHover(msg, msgIndex, 'enter')"
    @mouseleave="trackMessageHover(msg, msgIndex, 'leave')"
    :data-message-id="msg.id"
    :data-message-index="msgIndex"
    class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors duration-200 cursor-pointer message-item"
>
                <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="font-mono text-black font-bold">{{ msg.user.name }}</span>
                        <span class="font-mono text-xs text-gray-500">
                            {{ formatMessageDate(msg.created_at) }}
                        </span>
                        <span  v-if="msgIndex === 0" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                            OP
                        </span>
                        <span v-if="isRecentMessage(msg.created_at)" class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono animate-pulse">
                            Nouveau
                        </span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button 
                            @click.stop="trackMessageAction('like', msg)"
                            class="text-gray-400 hover:text-red-500 transition-colors"
                            :class="{ 'text-red-500': likedMessages.includes(msg.id) }"
                        >
                            ❤️ {{ msg.likes || 0 }}
                        </button>
                        <button 
                            @click.stop="trackMessageAction('quote', msg)"
                            class="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            💬 Citer
                        </button>
                        <span class="font-mono text-xs text-gray-400">#{{ msgIndex + 1 }}</span>
                    </div>
                </div>
                <div class="font-mono text-black" :class="{ 'opacity-75': readMessages.includes(msg.id) }">
                    {{ msg.content }}
                </div>
                
                <!-- Reading progress indicator -->
                <div v-if="messageReadingProgress[msg.id]" class="mt-2">
                    <div class="w-full bg-gray-200 rounded-full h-1">
                        <div 
                            class="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            :style="{ width: messageReadingProgress[msg.id] + '%' }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Real-time typing indicator -->
        <div v-if="typingUsers.length > 0" class="pixel-border pixel-border-gold p-3">
            <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="font-mono text-sm text-gray-600">
                    {{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'écrit' : 'écrivent' }}...
                </span>
            </div>
        </div>

        <!-- Message form with enhanced tracking -->
        <div v-if="thread && thread.id" class="mt-6">
            <message-form 
                :thread-id="thread.id" 
                @message-start="handleMessageStart"
                @message-typing="handleMessageTyping"
                @message-submit="handleMessageSubmit"
                @message-cancel="handleMessageCancel"
            />
        </div>

        <!-- Thread statistics panel -->
        <div class="mt-8 pixel-border pixel-border-dirt p-4">
            <h3 class="font-mono text-lg font-bold text-black mb-4">📊 Statistiques en temps réel</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="font-mono text-2xl font-bold text-blue-600">{{ realTimeStats.views }}</div>
                    <div class="font-mono text-xs text-gray-600">Vues totales</div>
                </div>
                <div class="text-center">
                    <div class="font-mono text-2xl font-bold text-green-600">{{ realTimeStats.activeReaders }}</div>
                    <div class="font-mono text-xs text-gray-600">Lecteurs actifs</div>
                </div>
                <div class="text-center">
                    <div class="font-mono text-2xl font-bold text-purple-600">{{ userEngagement.readingTime }}s</div>
                    <div class="font-mono text-xs text-gray-600">Temps de lecture</div>
                </div>
                <div class="text-center">
                    <div class="font-mono text-2xl font-bold text-orange-600">{{ userEngagement.scrollProgress }}%</div>
                    <div class="font-mono text-xs text-gray-600">Progression</div>
                </div>
            </div>
            
            <!-- Reading heatmap -->
            <div class="mt-4">
                <h4 class="font-mono text-sm font-bold text-black mb-2">🔥 Heatmap de lecture</h4>
                <div class="flex space-x-1">
                    <div 
                        v-for="(heat, index) in readingHeatmap"
                        :key="index"
                        class="flex-1 h-4 rounded"
                        :class="getHeatmapColor(heat)"
                        :title="`Message ${index + 1}: ${heat}% d'engagement`"
                    ></div>
                </div>
            </div>
        </div>

        <!-- User interaction timeline -->
        <div class="mt-6 pixel-border pixel-border-stone p-4" v-if="showInteractionTimeline">
            <h3 class="font-mono text-lg font-bold text-black mb-4">⏱️ Timeline d'interaction</h3>
            <div class="space-y-2 max-h-40 overflow-y-auto">
                <div 
                    v-for="interaction in recentInteractions.slice().reverse()" 
                    :key="interaction.id"
                    class="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                >
                    <span class="font-mono">{{ interaction.action }}</span>
                    <span class="font-mono text-gray-500">{{ formatTime(interaction.timestamp) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MessageForm from '../../components/form/MessageForm.vue';
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue';
import { useMatomo } from '../../composables/useMatomo';

// Props
const props = defineProps<{
    thread: {
        id: number;
        title: string;
        messages: Array<{
            id: number;
            content: string;
            created_at: string;
            user: { name: string };
            likes?: number;
        }>;
    };
}>();

const matomo = useMatomo();

const startTime = ref(Date.now());
const readMessages = ref(new Set());
const likedMessages = ref([]);
const messageReadingProgress = ref({});
const messageViewTimes = ref({});
const userEngagement = reactive({
    readingTime: 0,
    scrollProgress: 0,
    messagesRead: 0,
    interactionCount: 0
});

const realTimeStats = reactive({
    views: Math.floor(Math.random() * 500) + 100,
    activeReaders: Math.floor(Math.random() * 10) + 1,
    avgReadTime: 0,
    engagementRate: 0
});

const typingUsers = ref([]);
const recentInteractions = ref([]);
const readingHeatmap = ref([]);
const showInteractionTimeline = ref(false);

const lastActivityTime = computed(() => {
    const lastMessage = props.thread.messages[props.thread.messages.length - 1];
    return formatMessageDate(lastMessage?.created_at || '');
});

const trackPageLoad = () => {
    matomo.initPageTracking('thread_view', 'authenticated');
    matomo.trackForumPage('thread', undefined, props.thread.title);
    matomo.setCustomVariable(4, 'Thread_ID', props.thread.id.toString(), 'page');
    matomo.setCustomVariable(5, 'Message_Count', props.thread.messages.length.toString(), 'page');
    matomo.trackEvent('Forum', 'Thread_View', props.thread.title);
    
    // Track thread characteristics
    const threadStats = {
        messageCount: props.thread.messages.length,
        titleLength: props.thread.title.length,
        uniqueAuthors: new Set(props.thread.messages.map(m => m.user.name)).size
    };
    
    matomo.trackEvent('Forum', 'Thread_Characteristics', JSON.stringify(threadStats));
};

const trackMessageClick = (message: any, index: number) => {
    matomo.trackEvent('Forum', 'Message_Click', `message_${message.id}_position_${index}`);
    matomo.trackUserAction('message_interaction', `thread_${props.thread.id}_message_${message.id}`);
    
    userEngagement.interactionCount++;
    
    addInteraction('Message cliqué', `#${index + 1} par ${message.user.name}`);
    
    trackReadingPattern(message, index);
};

const trackMessageHover = (message: any, index: number, action: 'enter' | 'leave') => {
    if (action === 'enter') {
        messageViewTimes.value[message.id] = Date.now();
        matomo.trackEvent('Forum', 'Message_Hover_Start', `message_${index}`);
    } else if (action === 'leave' && messageViewTimes.value[message.id]) {
        const viewTime = Date.now() - messageViewTimes.value[message.id];
        matomo.trackEvent('Forum', 'Message_View_Time', `message_${index}_${viewTime}ms`);
        
        if (viewTime > 3000) { 
            readMessages.value.add(message.id);
            userEngagement.messagesRead++;
            matomo.trackEngagement('forum_message_read', `thread_${props.thread.id}_message_${message.id}`);
        }
        
        const progressPercent = Math.min(100, (viewTime / 10000) * 100);
        messageReadingProgress.value[message.id] = progressPercent;
        
        delete messageViewTimes.value[message.id];
    }
};

const trackMessageAction = (action: string, message: any) => {
    matomo.trackEvent('Forum', 'Message_Action', `${action}_message_${message.id}`);
    matomo.trackUserAction(`message_${action}`, `thread_${props.thread.id}`);
    
    if (action === 'like' && !likedMessages.value.includes(message.id)) {
        likedMessages.value.push(message.id);
        matomo.trackEngagement('forum_like', `message_${message.id}`);
    }
    
    addInteraction(`Message ${action}`, `#${props.thread.messages.findIndex(m => m.id === message.id) + 1}`);
    userEngagement.interactionCount++;
};

const trackReadingPattern = (message: any, index: number) => {
    const readingOrder = Array.from(readMessages.value);
    matomo.trackEvent('Forum', 'Reading_Pattern', `sequence_${readingOrder.length}_message_${index}`);
    
    if (readingOrder.length > 1) {
        const lastReadIndex = props.thread.messages.findIndex(m => m.id === readingOrder[readingOrder.length - 2]);
        const currentIndex = index;
        const isSequential = Math.abs(currentIndex - lastReadIndex) === 1;
        
        matomo.trackEvent('Forum', 'Reading_Behavior', isSequential ? 'sequential' : 'jumping');
    }
};

const trackScrollBehavior = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    userEngagement.scrollProgress = scrollPercent;
    
    const messages = document.querySelectorAll('.message-item');
    messages.forEach((messageEl, index) => {
        const rect = messageEl.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.bottom <= windowHeight;
        
        if (isInViewport && !readMessages.value.has(props.thread.messages[index].id)) {
            trackMessageInViewport(props.thread.messages[index], index);
        }
    });
    
    updateReadingHeatmap();
};

const trackMessageInViewport = (message: any, index: number) => {
    if (!messageViewTimes.value[message.id]) {
        messageViewTimes.value[message.id] = Date.now();
        matomo.trackEvent('Forum', 'Message_In_Viewport', `message_${index}`);
    }
};

const updateReadingHeatmap = () => {
    readingHeatmap.value = props.thread.messages.map((message, index) => {
        const baseHeat = readMessages.value.has(message.id) ? 50 : 0;
        const interactionHeat = likedMessages.value.includes(message.id) ? 30 : 0;
        const progressHeat = messageReadingProgress.value[message.id] || 0;
        
        return Math.min(100, baseHeat + interactionHeat + (progressHeat * 0.2));
    });
};

const getHeatmapColor = (heat: number) => {
    if (heat >= 80) return 'bg-red-500';
    if (heat >= 60) return 'bg-orange-500';
    if (heat >= 40) return 'bg-yellow-500';
    if (heat >= 20) return 'bg-blue-500';
    return 'bg-gray-300';
};

const addInteraction = (action: string, details: string = '') => {
    recentInteractions.value.push({
        id: Date.now(),
        action: `${action} ${details}`.trim(),
        timestamp: Date.now()
    });
    
    // Keep only last 10 interactions
    if (recentInteractions.value.length > 10) {
        recentInteractions.value = recentInteractions.value.slice(-10);
    }
    
    showInteractionTimeline.value = recentInteractions.value.length > 0;
};

// Message form handlers
const handleMessageStart = () => {
    matomo.trackEvent('Forum', 'Reply_Start', props.thread.title);
    matomo.trackUserAction('reply_start', `thread_${props.thread.id}`);
    addInteraction('Début de réponse');
};

const handleMessageTyping = (content: string) => {
    if (content.length === 10) { // First substantial typing
        matomo.trackEvent('Forum', 'Reply_Typing', 'substantial_content');
    }
    
    // Simulate typing indicator for other users
    if (content.length > 0 && !typingUsers.value.includes('Vous')) {
        typingUsers.value = ['Vous'];
        setTimeout(() => {
            typingUsers.value = [];
        }, 3000);
    }
};

const handleMessageSubmit = (success: boolean) => {
    if (success) {
        matomo.trackFormSubmission('forum_message', true);
        matomo.trackGoal(7);
        addInteraction('Message envoyé');
        
        const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
        matomo.trackEvent('Forum', 'Quality_Engagement', JSON.stringify({
            timeSpent,
            messagesRead: userEngagement.messagesRead,
            interactionCount: userEngagement.interactionCount,
            scrollProgress: userEngagement.scrollProgress
        }));
    } else {
        matomo.trackFormSubmission('forum_message', false);
        addInteraction('Erreur envoi message');
    }
};

const handleMessageCancel = () => {
    matomo.trackEvent('Forum', 'Reply_Cancel', props.thread.title);
    addInteraction('Annulation de réponse');
};

const updateRealTimeStats = () => {
    realTimeStats.views += Math.floor(Math.random() * 3);
    realTimeStats.activeReaders = Math.max(1, realTimeStats.activeReaders + (Math.random() > 0.5 ? 1 : -1));
    realTimeStats.avgReadTime = userEngagement.readingTime;
    realTimeStats.engagementRate = Math.round((userEngagement.interactionCount / props.thread.messages.length) * 100);
    
    if (Math.random() > 0.9 && typingUsers.value.length === 0) {
        const fakeUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        typingUsers.value = [randomUser];
        
        setTimeout(() => {
            typingUsers.value = [];
        }, Math.random() * 5000 + 2000);
    }
    
    matomo.trackEvent('Forum', 'Real_Time_Stats', JSON.stringify(realTimeStats));
};

const trackUserEngagement = () => {
    userEngagement.readingTime = Math.round((Date.now() - startTime.value) / 1000);
    
    const engagementData = {
        ...userEngagement,
        threadId: props.thread.id,
        messageCount: props.thread.messages.length,
        readPercentage: Math.round((userEngagement.messagesRead / props.thread.messages.length) * 100)
    };
    
    matomo.trackEvent('Forum', 'User_Engagement', JSON.stringify(engagementData));
};

const isRecentMessage = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
};

const formatMessageDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
};

const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
};

let realTimeInterval: NodeJS.Timeout;
let engagementInterval: NodeJS.Timeout;

onMounted(() => {
    trackPageLoad();
    
    window.addEventListener('scroll', trackScrollBehavior, { passive: true });
    
    realTimeInterval = setInterval(() => {
        updateRealTimeStats();
    }, 3000);
    
    engagementInterval = setInterval(() => {
        trackUserEngagement();
    }, 10000);
    
    setTimeout(() => {
        matomo.trackEngagement('thread_time_milestone', '30s');
        addInteraction('30s de lecture');
    }, 30000);
    
    setTimeout(() => {
        matomo.trackEngagement('thread_time_milestone', '60s');
        addInteraction('1min de lecture');
    }, 60000);
    
    setTimeout(() => {
        matomo.trackEngagement('thread_time_milestone', '300s');
        addInteraction('5min de lecture');
        
        matomo.trackEvent('Forum', 'Deep_Engagement', props.thread.title);
    }, 300000);
    
    updateRealTimeStats();
    updateReadingHeatmap();
    
    const referrer = document.referrer;
    if (referrer.includes('forum')) {
        matomo.trackEvent('Forum', 'Entry_Method', 'from_forum_list');
    } else if (referrer.includes('search')) {
        matomo.trackEvent('Forum', 'Entry_Method', 'from_search');
    } else {
        matomo.trackEvent('Forum', 'Entry_Method', 'direct_link');
    }
    
    matomo.trackEvent('Forum', 'Reading_Context', window.innerWidth > 768 ? 'desktop' : 'mobile');
});

onUnmounted(() => {
    if (realTimeInterval) clearInterval(realTimeInterval);
    if (engagementInterval) clearInterval(engagementInterval);
    
    window.removeEventListener('scroll', trackScrollBehavior);
    
    trackUserEngagement();
    
    const sessionSummary = {
        timeSpent: Math.round((Date.now() - startTime.value) / 1000),
        messagesRead: userEngagement.messagesRead,
        readPercentage: Math.round((userEngagement.messagesRead / props.thread.messages.length) * 100),
        interactionCount: userEngagement.interactionCount,
        maxScrollDepth: userEngagement.scrollProgress,
        likedMessages: likedMessages.value.length,
        engagementQuality: userEngagement.interactionCount > 0 ? 'high' : userEngagement.messagesRead > props.thread.messages.length * 0.5 ? 'medium' : 'low'
    };
    
    matomo.trackEvent('Forum', 'Session_Summary', JSON.stringify(sessionSummary));
    
    // Track exit behavior
    const exitBehavior = {
        readCompletely: userEngagement.messagesRead === props.thread.messages.length,
        interacted: userEngagement.interactionCount > 0,
        timeSpent: sessionSummary.timeSpent,
        exitPoint: userEngagement.scrollProgress
    };
    
    matomo.trackEvent('Forum', 'Exit_Behavior', JSON.stringify(exitBehavior));
});
</script>

<style scoped>
.message-item {
    transition: all 0.2s ease;
}

.message-item:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pixel-border:hover {
    transform: translateY(-1px);
    transition: transform 0.1s ease-in-out;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
    animation: bounce 1s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

.heatmap-item {
    position: relative;
}

.heatmap-item:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: black;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
}

.typing-indicator {
    animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-10px);
    }
}

.stat-number {
    transition: all 0.3s ease;
}

.stat-number.updated {
    transform: scale(1.1);
    color: #10b981;
}

.interaction-timeline {
    max-height: 200px;
    overflow-y: auto;
}

.interaction-timeline::-webkit-scrollbar {
    width: 4px;
}

.interaction-timeline::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.interaction-timeline::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
}

.interaction-timeline::-webkit-scrollbar-thumb:hover {
    background: #555;
}

@media (max-width: 768px) {
    .space-y-6 {
        padding: 1rem;
    }
    
    .grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .message-item {
        padding: 0.75rem;
    }
    
    .interaction-timeline {
        max-height: 150px;
    }
}

.liked {
    background: linear-gradient(90deg, #fee2e2, transparent);
}

.reading {
    background: linear-gradient(90deg, #dbeafe, transparent);
}

.new-message {
    border-left: 4px solid #10b981;
}
</style>