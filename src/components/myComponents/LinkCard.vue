<template>
  <div
    class="link-card relative cursor-pointer w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-transform -translate-y-5 opacity-0"
    @click="openLink(item.item_url)" :style="{ transitionDelay: `${delay}s` }"
    :class="{ 'opacity-100 translate-y-0': animated }">
    <div class="flex items-center gap-3">
      <img :src="item.icon" class="w-10 h-10" />
      <div class="flex-1 text-nowrap overflow-hidden">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100" v-html="highlightKeyword(item.title)"></h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate" v-html="highlightKeyword(item.item_desc)"></p>
      </div>
    </div>

    <ContextMenu>
      <ContextMenuTrigger class="absolute w-full h-full left-0 top-0"> </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem @click="openItemEditDialog">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          编辑
        </ContextMenuItem>
        <ContextMenuItem @click="openItemDeleteDialog">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

const props = defineProps({
  item: { type: Object, required: true },
  delay: { type: Number, default: 0 },
  keyword: { type: String, default: '' },
});
const emits = defineEmits(['openItemEditDialog', 'openItemDeleteDialog']);
const animated = ref(false);

onMounted(() => {
  // 触发Tailwind过渡类切换
  setTimeout(() => (animated.value = true), props.delay * 1000);
});

const highlightKeyword = (text) => {
  if (!props.keyword) return text;
  const regex = new RegExp(props.keyword, 'gi');
  return text.replace(regex, (match) => `<span class="bg-yellow-100 dark:bg-yellow-800 rounded-sm p-0.5">${match}</span>`);
}

const openItemEditDialog = () => {
  emits('openItemEditDialog', props.item);
};

const openItemDeleteDialog = () => {
  emits('openItemDeleteDialog', props.item);
}

const openLink = (url) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
.link-card {
  transition: all 0.6s ease;
}
</style>
