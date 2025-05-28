<template>
  <Dialog v-model:open="open">
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 sm:max-w-[95dvw] max-h-[90dvh]">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>
          {{ blog.title }}
        </DialogTitle>
        <DialogDescription>
          <div class="flex items-center text-sm gap-4">
            <span class="text-[#00323c] dark:text-gray-300 hover:text-[#11A8CD] dark:hover:text-[#11A8CD] cursor-pointer flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {{ blog.author }}
            </span>
            <span class="text-[#00323c] dark:text-gray-300 hover:text-[#11A8CD] dark:hover:text-[#11A8CD] cursor-pointer flex items-center"
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              {{ blog.update_time }}
            </span>
            <span class="text-[#00323c] dark:text-gray-300 hover:text-[#11A8CD] dark:hover:text-[#11A8CD] cursor-pointer flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              {{ blog.category }}
            </span>
          </div>
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto px-6">
        <div class="flex flex-col justify-between">
          <img :src="blog.cover" alt="封面" class="w-full h-60 object-cover rounded-lg" />
          <v-md-preview :text="blog.markdown_content" />
        </div>
      </div>
      <DialogFooter class="p-6 pt-0"> </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ref, onMounted, watch } from 'vue';

const blog = ref('');
const open = ref(false);

const props = defineProps({
  dialogOpen: Boolean,
  dialogId: String,
});

const emits = defineEmits(['closeDialog']);

onMounted(() => {
  getBlogDetail(props.dialogId);
  blog.value.markdown_content = localStorage.getItem('markdown_content');
});

watch(
  () => props.dialogOpen,
  (newValue) => {
    open.value = newValue;
  }
);
watch(()=>props.dialogId, (newValue) => {
  getBlogDetail(newValue);
})
watch(
  open,
  (newValue) => {
    if (!newValue) {
      emits('closeDialog');
    }
  }
)

const mockData = {
  title: 'Vue3 组件库开发',
  markdown_content: '',
  cover: '/blog1.jpg',
  author: 'KaiXuanXuan',
  update_time: '2024-07-11',
  category: 'Vue3',
}
const getBlogDetail = (id)=>{
  blog.value = mockData;
}
</script>

<style lang="scss" scoped></style>
