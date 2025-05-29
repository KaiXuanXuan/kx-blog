<template>
  <div
    class="link-card cursor-pointer w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-transform opacity-0"
    @click="openLink(item.url)"
    :style="{ transitionDelay: `${delay}s` }"
    :class="{ 'translate-y-0 opacity-100': animated }"
  >
    <div class="flex items-start gap-3">
      <div class="text-2xl">{{ item.icon }}</div>
      <div class="flex-1 text-nowrap overflow-hidden">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  item: { type: Object, required: true },
  delay: { type: Number, default: 0 },
});
const animated = ref(false);

onMounted(() => {
  // 触发Tailwind过渡类切换
  setTimeout(() => (animated.value = true), props.delay * 1000);
});

const openLink = (url) => {
  window.open(url, '_blank');
}
</script>

<style scoped>
.link-card {
  transition: opacity 0.6s ease;
}
</style>
