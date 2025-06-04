<template>
  <header v-if="routeReady && !$route.meta.hideNav" class="fixed w-full z-10 backdrop-blur-md">
    <Navigation />
  </header>
  <div :class="[$route.meta.hideNav ? '' : 'pt-14', 'w-full h-full']">
    <RouterView />
    <Toaster richColors />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
import Navigation from '@/components/myComponents/Navigation.vue';

const router = useRouter();
const routeReady = ref(false);

onMounted(async () => {
  await router.isReady();
  routeReady.value = true;
});
</script>

<style scoped></style>
