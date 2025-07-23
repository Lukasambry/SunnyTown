<template>
    <div class="save-fab-container fixed bottom-28 right-6 z-40">
        <!-- Floating Save Button -->
        <button
            class="save-button group relative rounded-full transition-all duration-300 flex items-center justify-center text-white"
            @click="openModal">
            <!-- Disquette Icon -->
            <div class="transition-transform duration-300 group-hover:scale-110">
                <img src="/assets/game/ui/buttons/floppy.png"
                     :style="{ imageRendering: 'pixelated'}"
                     alt="Sauvegarder"
                     class="w-20">
            </div>
        </button>

        <!-- Save Manager Modal -->
        <SaveManagerUI :visible="isModalOpen" :onClose="closeModal" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SaveManagerUI from './SaveManagerUI.vue'

const isModalOpen = ref(false)
const openModal = () => { isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false }
</script>

<style scoped>
.save-button:hover {
    transform: translateY(-2px);
}

.save-button:active {
    transform: translateY(0);
}

/* Floating animation */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}

.save-button {
    animation: float 3s ease-in-out infinite;
}

.save-button:hover {
    animation: none;
}

/* Modal styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-content {
    animation: modal-slide-in 0.3s ease-out;
}

@keyframes modal-slide-in {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
