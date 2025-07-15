<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ResourceStack } from '@game/types/ResourceSystemTypes.ts';
import { ResourceManager } from '@game/services/ResourceManager.ts';

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
        class="resource-item"
        :class="[
            'flex items-center gap-2 rounded-lg px-3 py-2 backdrop-blur-sm',
            'border border-gray-600/30 bg-black/70 text-white',
            'transition-all duration-200 hover:bg-black/80',
            sizeClasses,
        ]"
    >
        <!-- Resource Icon -->
        <div class="flex flex-shrink-0 items-center justify-center rounded-full" :class="iconClasses">
            <img
                :src="`/assets/game/ui/resources/${resource.type}.png`"
                :style="{ imageRendering: 'pixelated' }"
                :alt="`SunnyTown ${resource.type} icon`"
                class="w-12"
            />
        </div>

        <!--
          <div class="relative flex-shrink-0 rounded-full flex items-center justify-center">
              <img src="/assets/game/ui/buttons/empty.png"
                   :style="{ imageRendering: 'pixelated'}"
                   :alt="`SunnyTown empty button`"
                   class="w-12">

              <img :src="`/assets/game/ui/resources/${resource.type}.png`"
                   :style="{ imageRendering: 'pixelated'}"
                   :alt="`SunnyTown ${resource.type} icon`"
                   class="w-[60%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%]">
          </div>
          -->

        <!-- Resource Amount -->
        <span class="resource-amount font-bold tabular-nums" :class="amountClasses">
            {{ formatAmount(resource.amount) }}
        </span>

        <!-- Resource Name (optional) -->
        <span v-if="showName" class="resource-name text-sm font-medium text-gray-200">
            {{ resourceName }}
        </span>
    </div>
</template>

<style scoped>
.resource-item {
    min-width: fit-content;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.resource-icon {
    position: relative;
    overflow: hidden;
}

.resource-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    pointer-events: none;
}

.tabular-nums {
    font-variant-numeric: tabular-nums;
}
</style>
