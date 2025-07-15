<script setup lang="ts">
import { ResourceManager } from '@game/services/ResourceManager.ts';
import type { ResourceStack } from '@game/types/ResourceSystemTypes.ts';
import { computed, onMounted, ref } from 'vue';

interface Props {
    resource: ResourceStack;
    showName?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    showName: false,
    size: 'md',
});

// FIX: S'assurer que ResourceManager est initialisé
const resourceManager = ref<any>(null);

onMounted(() => {
    try {
        resourceManager.value = ResourceManager.getInstance();
    } catch (error) {
        console.error('Error getting ResourceManager:', error);
    }
});

const resourceData = computed(() => {
    if (!resourceManager.value) return null;
    try {
        return resourceManager.value.getDefinition(props.resource.type);
    } catch (error) {
        console.error('Error getting resource definition:', error);
        return null;
    }
});

const resourceName = computed(() => {
    if (!resourceData.value) return 'Unknown';
    return resourceData.value.name || 'Unknown';
});

const sizeClasses = computed(() => {
    const sizeMap = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    return sizeMap[props.size];
});

const iconClasses = computed(() => {
    const sizeMap = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };
    return sizeMap[props.size];
});

const amountClasses = computed(() => {
    const sizeMap = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    return sizeMap[props.size];
});

const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
};
</script>

<template>
    <div
        class="min-w-fit w-fit"
        :class="[
            'flex items-center justify-end gap-2 px-2 pr-9 pixel-border pixel-border-stone',
            'transition-all duration-200',
            sizeClasses,
        ]"
    >
<!--        <div class="flex flex-shrink-0 items-center justify-center rounded-full" :class="iconClasses">-->
<!--            <img-->
<!--                :src="`/assets/game/ui/resources/${resource.type}.png`"-->
<!--                :style="{ imageRendering: 'pixelated' }"-->
<!--                :alt="`SunnyTown ${resource.type} icon`"-->
<!--                class="w-12"-->
<!--            />-->
<!--        </div>-->

        <span class="resource-amount text-xl font-bold text-slate-700" :class="amountClasses">
            {{ formatAmount(resource.amount) }}
        </span>

<!--        <span v-if="showName" class="resource-name text-lg font-medium leading-0 text-slate-500">-->
<!--            {{ resourceName }}-->
<!--        </span>-->

        <div class="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-shrink-0 items-center justify-center rounded-full">
            <img src="/assets/game/ui/itemdisc.png" :alt="`SunnyTown empty button`" class="pixelated w-14" />
            <img
                :src="`/assets/game/ui/resources/${resource.type}.png`"
                :alt="`SunnyTown ${resource.type} icon`"
                class="pixelated absolute top-[50%] left-[50%] w-[60%] translate-x-[-50%] translate-y-[-60%]"
            />
        </div>
    </div>
</template>
