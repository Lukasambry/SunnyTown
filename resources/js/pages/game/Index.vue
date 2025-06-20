<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import GameComponent from '@/components/game/Game.vue';
</script>

<template>
    <Head title="Welcome">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
    <GameComponent/>
 </template>
