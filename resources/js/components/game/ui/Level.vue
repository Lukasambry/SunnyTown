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
    <div class="fixed top-8 left-8 h-20 max-w-72 flex gap-4 z-10">
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
                    <img :src="healthIcon" alt="Health Icon" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-auto pixelated">
<!--                    <span class="pixel-font absolute right-0 top-1/2 -translate-y-1/2 text-white text-[9px] font-bold text-shadow-multi">{{ health.current }}/{{ health.max }}</span>-->
                </div>
                <div class="relative pixel-progress w-36">
                    <span class="pixel-progress-bar bg-cyan-400" :style="{ width: `${(experience.current / experience.nextLevel) * 100}%` }"></span>
                    <img :src="experienceIcon" alt="Experience Icon" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-auto pixelated">
                </div>
            </div>
            <div class="pixel-border pixel-border-gold w-fit text-md px-0.5 max-h-4.5 flex justify-center items-center gap-1.5 ml-0.5">
                <img :src="goldIcon" class="h-4 w-auto pixelated" alt="Coins">
                <p>{{ gold?.toLocaleString() }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes pulse-glow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
}
</style>
