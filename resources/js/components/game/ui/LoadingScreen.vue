<template>
    <div class="absolute left-0 top-0 p-1 h-screen w-screen !z-[9998]">
        <div class="pixel-border pixel-border-dark-dirt w-full h-full">
            <div class="relative pixel-border pixel-border-dirt h-full w-full overflow-hidden">
                <img src="/assets/game/ui/loading-bg-1024x571.png" alt="bg" class="h-full w-full object-cover" />

                <div class="absolute top-0 bg-black/50 backdrop-blur flex-col h-full w-full m-auto flex justify-center items-center">
                    <div class="max-w-3xl mx-auto w-full">
                        <img src="/assets/game/ui/sunnytown-logo-aquarel-600x400.png" class="mx-auto" alt="logo" />

                        <div class="pixel-progress mb-4" style="--pixel-border-size: 5px">
                            <div
                                class="pixel-progress-bar bg-green-400 transition-all duration-300 ease-out"
                                :style="{ width: `${currentProgress}%` }"
                            >
                            </div>
                        </div>

                        <div class="flex justify-between items-center mb-4 text-white text-lg">
                            <span class="font-medium">{{ Math.round(currentProgress) }}%</span>
                            <span class="opacity-75">{{ currentStep }}/{{ totalSteps }}</span>
                        </div>

                        <Transition name="fade" mode="out-in">
                            <div
                                :key="currentMessage"
                                class="text-white text-center text-lg font-medium min-h-[2rem] flex items-center justify-center"
                            >
                                {{ currentMessage }}
                                <span
                                    v-if="showDots"
                                    class="ml-1 animate-pulse"
                                >{{ dots }}</span>
                            </div>
                        </Transition>

                        <div
                            v-if="currentProgress >= 100"
                            class="text-center mt-4 text-green-400 animate-bounce"
                        >
                            <div class="text-xl">✓ Prêt !</div>
                            <div class="text-sm opacity-75">Lancement du jeu...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

interface Props {
    progress?: number;
}

const props = defineProps<Props>();

const loadingSteps = [
    { message: 'Initialisation du moteur de jeu', duration: 1000 },
    { message: 'Chargement des textures et sprites', duration: 1500 },
    { message: 'Construction du monde', duration: 2000 },
    { message: 'Placement des arbres et ressources', duration: 1500 },
    { message: 'Configuration de l\'interface utilisateur', duration: 1000 },
    { message: 'Préparation de votre aventure', duration: 1200 },
    { message: 'Finalisation du chargement', duration: 800 },
    { message: 'Presque prêt', duration: 500 }
];

const currentStep = ref(0);
const currentProgress = ref(0);
const targetProgress = ref(0);
const isGameReady = ref(false);
const showDots = ref(true);
const dots = ref('');

let stepInterval: NodeJS.Timeout | null = null;
let progressInterval: NodeJS.Timeout | null = null;
let dotsInterval: NodeJS.Timeout | null = null;

const totalSteps = computed(() => loadingSteps.length);
const currentMessage = computed(() => {
    if (isGameReady.value) return 'Lancement du jeu...';
    return loadingSteps[currentStep.value]?.message || 'Chargement...';
});

const startFakeLoading = () => {
    let stepIndex = 0;

    const processStep = () => {
        if (stepIndex >= loadingSteps.length) {
            waitForGameReady();
            return;
        }

        currentStep.value = stepIndex;
        const step = loadingSteps[stepIndex];

        const progressPerStep = 90 / loadingSteps.length;
        targetProgress.value = Math.min(90, (stepIndex + 1) * progressPerStep);

        setTimeout(() => {
            stepIndex++;
            processStep();
        }, step.duration);
    };
    processStep();
};

const animateProgressBar = () => {
    progressInterval = setInterval(() => {
        if (currentProgress.value < targetProgress.value) {
            currentProgress.value += 0.5;
        } else if (props.progress && props.progress > currentProgress.value) {
            currentProgress.value = Math.min(100, props.progress);
        }
    }, 16);
};

const animateDots = () => {
    let dotCount = 0;
    dotsInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dots.value = '.'.repeat(dotCount);
    }, 500);
};

const waitForGameReady = () => {
    const handleGameReady = () => {
        isGameReady.value = true;
        targetProgress.value = 100;

        window.dispatchEvent(new CustomEvent('loading:complete'));
    };

    window.addEventListener('game:ready', handleGameReady, { once: true });

    setTimeout(() => {
        if (!isGameReady.value) {
            console.warn('Timeout: forcing game ready state');
            handleGameReady();
        }
    }, 2000);
};

watch(() => props.progress, (newProgress) => {
    if (newProgress && newProgress > targetProgress.value) {
        targetProgress.value = Math.min(100, newProgress);
    }
});

onMounted(() => {
    startFakeLoading();
    animateProgressBar();
    animateDots();
});

onUnmounted(() => {
    if (stepInterval) clearInterval(stepInterval);
    if (progressInterval) clearInterval(progressInterval);
    if (dotsInterval) clearInterval(dotsInterval);
});
</script>

<style scoped>

@keyframes shimmer {
    0% {
        transform: translateX(-100%) skewX(-12deg);
    }
    100% {
        transform: translateX(300%) skewX(-12deg);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        transform: translate3d(0, -8px, 0);
    }
    70% {
        transform: translate3d(0, -4px, 0);
    }
    90% {
        transform: translate3d(0, -2px, 0);
    }
}

.animate-bounce {
    animation: bounce 2s infinite;
}
</style>
