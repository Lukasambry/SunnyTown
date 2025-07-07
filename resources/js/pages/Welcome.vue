<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

defineProps({appEnv: String})

</script>

<template>
    <Head title="Welcome">
        <Link rel="preconnect" href="https://rsms.me/" />
        <Link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
</template>
