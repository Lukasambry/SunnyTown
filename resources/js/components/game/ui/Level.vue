<script lang="ts">
import defaultAvatar from '@ui/test_avatar.png';
import defaultHealthIcon from '@ui/health_icon.png';
import defaultExperienceIcon from '@ui/experience_icon.png';
import defaultGoldIcon from '@ui/coin.png';

export default {
    props: {
        avatar: {
            type: String,
            default: defaultAvatar,
        },
        healthIcon: {
            type: String,
            default: defaultHealthIcon,
        },
        experienceIcon: {
            type: String,
            default: defaultExperienceIcon,
        },
        goldIcon: {
            type: String,
            default: defaultGoldIcon,
        },
        level: Number,
        gold: Number,
        health: {
            type: Object,
            required: true
        },
        experience: {
            type: Object,
            required: true
        }
    }
}
</script>
<template>
    <div class="fixed top-8 left-8 h-20 max-w-72 flex gap-4">
        <div class="relative h-full">
            <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex align-items-center justify-center p-2 pb-3">
                <img src="/assets/game/ui/player.png" alt="player" class="pixelated h-full w-auto">
            </div>
            <div class="position-absolute bottom-1 px-0.5 pixel-border pixel-border-stone max-h-4 flex items-center text-md w-fit left-1/2 -translate-x-1/2 !text-slate-700">
                Lv.{{ level }}
            </div>
        </div>

        <div class="flex flex-col justify-between w-full">
            <div class="flex flex-col gap-3 ml-1">
                <div class="relative pixel-progress w-48">
                    <span class="pixel-progress-bar bg-red-400" :style="{ width: `${(health.current / health.max) * 100}%` }"></span>
                    <img :src="healthIcon" alt="Health Icon" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-auto z-10 pixelated">
<!--                    <span class="pixel-font absolute right-0 top-1/2 -translate-y-1/2 text-white text-[9px] font-bold text-shadow-multi">{{ health.current }}/{{ health.max }}</span>-->
                </div>
                <div class="relative pixel-progress w-36">
                    <span class="pixel-progress-bar bg-cyan-400" :style="{ width: `${(experience.current / experience.nextLevel) * 100}%` }"></span>
                    <img :src="experienceIcon" alt="Experience Icon" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-auto z-10 pixelated">
                </div>
            </div>
            <div class="pixel-border pixel-border-gold w-fit text-md px-0.5 max-h-4.5 flex justify-center items-center gap-1.5 ml-0.5">
                <img :src="goldIcon" class="h-4 w-auto pixelated" alt="Coins">
                <p>{{ gold?.toLocaleString() }}</p>
            </div>
        </div>
    </div>


    <!--<div class="backdrop-blur font-mono gap-2 grid-cols-[auto_150px] mt-56 inline-grid p-2 rounded-lg w-fit">
        <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 bg-[#8b7355] border-2 border-[#654321] rounded p-0.5 shadow-inner">
                <img :src="avatar" :alt="`Player Avatar`" class="w-full h-full object-cover rounded-sm rendering-pixelated">
            </div>

            <div class="py-0.5 px-2">
                <span class="text-gray-200 text-[10px] font-bold text-shadow">Lvl. {{ level }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <div class="relative h-5">
                <div class="absolute left-2 mt-1 w-full h-3.5 bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
                    <div class="health-fill h-full rounded-md transition-width duration-300"
                         :style="{ width: `${(health.current / health.max) * 100}%` }">
                    </div>
                    <div class="absolute mt-1 inset-0 flex items-center justify-center pointer-events-none">
                        <span class="text-white text-[9px] font-bold text-shadow-multi">{{ health.current }}/{{ health.max }}</span>
                    </div>
                </div>
                <img :src="healthIcon" alt="Health Icon" class="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 z-10">
            </div>

            <div class="relative h-5">
                <div class="absolute left-2 w-full mt-1 h-3.5 bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
                    <div class="experience-fill h-full rounded-md transition-width duration-300"
                         :style="{ width: `${(experience.current / experience.nextLevel) * 100}%` }">
                    </div>
                    <div class="absolute mt-1 inset-0 flex items-center justify-center pointer-events-none">
                        <span class="text-white text-[9px] font-bold text-shadow-multi">{{ experience.current }}/{{ experience.nextLevel }}</span>
                    </div>
                </div>
                <img :src="experienceIcon" alt="Experience Icon" class="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 z-10">
            </div>

            <div class="bg-gold-primary border-b-gold-secondary flex gap-1 items-center mt-2 rounded-md w-[60%]">
                <img :src="goldIcon" alt="Gold Icon" class="w-4 h-4 rounded-md">
                <span class="text-[#fffbeb] text-[11px] font-bold text-shadow min-w-0">{{ gold?.toLocaleString() }}</span>
            </div>
        </div>
    </div>-->
</template>

<style scoped>
.text-shadow {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.text-shadow-multi {
    text-shadow:
        0 1px 2px rgba(0, 0, 0, 0.8),
        -1px -1px 0 rgba(0, 0, 0, 0.8),
        1px -1px 0 rgba(0, 0, 0, 0.8),
        -1px 1px 0 rgba(0, 0, 0, 0.8),
        1px 1px 0 rgba(0, 0, 0, 0.8);
}

.rendering-pixelated {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.health-fill {
    background-color: #e53e3e;
    box-shadow:
        0 0 8px rgba(229, 62, 62, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    background-size: 8px 8px;
    animation: pulse-glow 2s ease-in-out infinite;
}

.experience-fill {
    background-color: #3182ce;
    box-shadow:
        0 0 8px rgba(49, 130, 206, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    background-size: 8px 8px;
    animation: pulse-glow 2s ease-in-out infinite;
}


@keyframes pulse-glow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
}
</style>
