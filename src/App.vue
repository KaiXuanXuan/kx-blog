<template>
  <header v-if="routeReady && !$route.meta.hideNav" class="fixed w-full z-10 backdrop-blur-md">
    <Navigation />
  </header>
  <div :class="[$route.meta.hideNav ? '' : 'pt-16', 'w-full h-full']">
    <RouterView />
    <Toaster richColors />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
import Navigation from '@/components/myComponents/Navigation.vue';

const router = useRouter();
const routeReady = ref(false);
const titleFix = process.env.NODE_ENV === 'production' ?  '' : '开发';
const originalTitle = '⌯>ᴗo⌯ಣ' + titleFix;
const blurTitle = '・ࡇ・' + titleFix;

onMounted(async () => {
  await router.isReady();
  routeReady.value = true;

  // 设置固定标题
  document.title = originalTitle;

  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

function handleVisibilityChange() {
  if (document.hidden) {
    document.title = blurTitle; // 失去焦点时显示的标题
  } else {
    document.title = originalTitle; // 恢复为固定标题
  }
}
</script>

<style scoped></style>
