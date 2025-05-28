<template>
  <div class="p-4">
    <div class="space-x-2 mb-4 inline-flex items-center">
      <div class="space-x-4 mr-30 items-center inline-flex">
        <Label class="inline-flex text-xl font-bold items-center">标题:</Label>
        <Input class="inline w-80" :disabled="editDisabled" v-model="formData.title" placeholder="请输入标题" />
        <Button @click="confirmTile" v-if="!editDisabled">确认</Button>
        <Button @click="editTitle" v-else>编辑</Button>
      </div>
      <Button variant="outline">导入markdown</Button>
      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button> 发布文章 </Button>
        </SheetTrigger>
        <SheetContent class="p-10">
          <SheetHeader class="p-0 mb-4">
            <SheetTitle> 发布文章 </SheetTitle>
            <SheetDescription>文章一经发布，本地缓存将清空</SheetDescription>
          </SheetHeader>
          <form @submit="onSubmit" class="space-y-4">
            <FormField name="title">
              <FormItem v-auto-animate>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input :disabled="editDisabled" type="text" placeholder="请输入标题" v-model="formData.title" autocomplete="off" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="cover">
              <FormItem v-auto-animate>
                <FormLabel>封面</FormLabel>
                <FormControl>
                  <Input type="file" autocomplete="off" @change="handleCoverChange" />
                </FormControl>
                <!-- 封面预览 -->
                <div class="flex items-center justify-center">
                  <img v-if="previewUrl" :src="previewUrl" class="mt-2 max-w-2xs" alt="封面预览" />
                </div>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="category">
              <FormItem v-auto-animate>
                <FormLabel>分类</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="请输入分类" v-model="formData.category" autocomplete="off" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <SheetFooter class="p-0 mt-8">
              <Button type="submit"> 确认发布 </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
    <v-md-editor v-model="formData.text" left-toolbar="undo redo | image link code hr bold italic strikethrough quote  tip " height="45rem" @save="handleSave"></v-md-editor>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { addBlog } from '@/api/blog';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const editDisabled = ref(false);
const previewUrl = ref('');
const formData = ref({
  title: '',
  text: '',
  category: '',
  cover: null,
  coverType: '',
});
let timer = '';
const open = ref(false);

onMounted(() => {
  // 从本地存储中读取数据
  for (const key in formData.value) {
    formData.value[key] = localStorage.getItem(key);
  }
  timer = setInterval(() => {
    handleSave('自动保存成功');
  }, 60000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const formSchema = toTypedSchema(
  z.object({
    title: z.string({ required_error: '标题必填' }),
    cover: z.string({ required_error: '封面得有' }),
    category: z.string({ required_error: '分类加上' }),
  })
);

const form = useForm({ validationSchema: formSchema });

const onSubmit = (e) => {
  e.preventDefault();
  if (formData.value.title === '') {
    toast.warning('标题不能为空');
    return;
  }
  if (formData.value.text === '') {
    toast.warning('内容不能为空');
    return;
  }
  if (formData.value.category === '') {
    toast.warning('分类不能为空');
    return;
  }
  if (formData.value.cover === null) {
    toast.warning('封面不能为空');
    return;
  }

  const { title, text, category, cover, coverType } = formData.value;
  const blob = new Blob([cover], { type: coverType });
  addBlog({ title, text, category }, blob).then((res) => {
    console.log(res);
  });
};

const confirmTile = () => {
  if (!formData.title.value) {
    toast.warning('标题不能为空');
    return;
  }
  editDisabled.value = true;
};
const editTitle = (val) => {
  editDisabled.value = false;
};

const handleCoverChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 检查是否是图片类型
  if (!file.type.startsWith('image/')) {
    toast.warning('请选择图片文件（支持jpg、png等格式）');
    return;
  }
  formData.value.coverType = file.type;

  // 读取文件为base64
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target.result;
    formData.value.cover = base64;
    // 生成预览链接
    previewUrl.value = URL.createObjectURL(file);
  };
  reader.readAsDataURL(file);
};

const handleSave = (msg = '保存成功') => {
  // 遍历formData，将所有值都保存到本地存储中
  for (const key in formData.value) {
    localStorage.setItem(key, formData.value[key]);
  }
  toast.success(msg);
};
</script>

<style lang="scss" scoped></style>
