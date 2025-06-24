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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-1">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {{ blog.author }}
            </span>
            <span class="text-[#00323c] dark:text-gray-300 hover:text-[#11A8CD] dark:hover:text-[#11A8CD] cursor-pointer flex items-center"
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-1">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              {{ formateDate(blog.update_time) }}
            </span>
            <span class="text-[#00323c] dark:text-gray-300 hover:text-[#11A8CD] dark:hover:text-[#11A8CD] cursor-pointer flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-1">
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
          <template v-if="props.mode === 'preview'">
            <img :src="formateUrl(blog.cover_image)" alt="封面" class="w-full h-80 object-cover rounded-lg mb-2" />
            <v-md-preview :text="blog.markdown_content" />
          </template>
          <template v-else>
            <div class="mb-2">
              <label class="block text-base font-medium mb-1">封面</label>
              <img :src="formateUrl(formData.cover_image)" alt="封面" class="w-full h-80 object-cover rounded-lg mb-2" />
              <input type="file" @change="handleCoverChange" class="w-full mb-2" />
            </div>
            <form @submit="onSubmit" class="space-y-4">
              <div class="flex flex-col sm:flex-row gap-4 items-end">
                <div class="w-full sm:flex-1">
                  <label class="block text-base font-medium mb-1">标题</label>
                  <input v-model="formData.title" placeholder="请输入标题" class="w-full border rounded p-2" />
                </div>
                <div class="w-full sm:flex-1">
                  <label class="block text-base font-medium mb-1">分类</label>
                  <input v-model="formData.category" placeholder="请输入分类" class="w-full border rounded p-2" />
                </div>
              </div>
              <v-md-editor v-model="formData.markdown_content" height="30rem" />
              <Button :disabled="isLoading" type="submit" class="w-full">{{ isLoading ? '发布中...' : '确认修改' }}</Button>
            </form>
          </template>
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
import { getBlogDetail, updateBlog } from '@/api/blog';
import { formateUrl, formateDate } from '@/utils/helper';
import { toast } from 'vue-sonner';

const blog = ref({});
const open = ref(false);
const markdown = ref('');

const props = defineProps({
  dialogOpen: Boolean,
  dialogId: String,
  mode: {
    type: String,
    default: 'preview', // 'preview' or 'editor'
    validator: (val) => ['preview', 'editor'].includes(val),
  },
});

const emits = defineEmits(['closeDialog', 'publishSuccess']);

const isLoading = ref(false);
const formData = ref({});

watch(
  () => props.dialogOpen,
  (newValue) => {
    open.value = newValue;
  }
);
watch(
  () => props.dialogId,
  (newValue) => {
    if (!newValue) return;
    getBlogData(newValue);
  }
);
watch(open, (newValue) => {
  if (!newValue) {
    emits('closeDialog');
  }
});

watch(
  () => blog.value.markdown_content,
  (newValue) => {
    if (props.mode === 'editor' && newValue) {
      markdown.value = newValue;
    }
  }
);

const getBlogData = (id) => {
  getBlogDetail(id).then((res) => {
    blog.value = res.data;
    formData.value = res.data;
  });
};

const handleCoverChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    // 这里可用toast或alert
    return;
  }
  formData.value.coverType = file.type;
  formData.value.coverName = file.name;
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target.result;
    formData.value.cover = base64;
  };
  reader.readAsDataURL(file);
};

const onSubmit = async (e) => {
  e.preventDefault && e.preventDefault();
  isLoading.value = true;
  try {
    const { title, markdown_content, category, cover_image, coverType, coverName } = formData.value;
    const file = coverType && coverName ? new File([cover_image], coverName, { type: coverType }) : undefined;
    const res = await updateBlog({ id: props.dialogId, title, markdown_content, category, cover_image }, file);
    toast.success(res.message || '更新成功');
    emits('publishSuccess', res.message || '更新成功');
    open.value = false;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
