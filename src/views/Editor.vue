<template>
  <div class="p-4">
    <div class="space-x-2 mb-4 inline-flex items-center">
      <div class="space-x-4 mr-30 items-center inline-flex">
        <Label class="inline-flex text-xl font-bold items-center">标题</Label>
        <Input class="inline w-80" v-model="formData.title" placeholder="请输入标题" />
        <Label class="inline-flex text-xl font-bold items-center ml-8">自动保存间隔</Label>
        <NumberField class="w-25" :default-value="timeInterval" :step="1" :min="30" v-model="timeInterval">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput :disabled="editDisabled" />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Button @click="confirmTimeInterval" v-if="!editDisabled">确认</Button>
        <Button @click="editTimeInterval" v-else>编辑</Button>
      </div>
      <Button variant="outline">导入markdown</Button>
      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button> 发布文章 </Button>
        </SheetTrigger>
        <SheetContent class="p-10">
          <SheetHeader class="p-0 mb-4">
            <SheetTitle class="text-xl"> 发布文章 </SheetTitle>
            <SheetDescription>文章一经发布，本地缓存将清空</SheetDescription>
          </SheetHeader>
          <form @submit="onSubmit" class="space-y-4">
            <FormField name="title">
              <FormItem v-auto-animate>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="请输入标题" v-model="formData.title" autocomplete="off" />
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
                  <img v-if="formData.cover" :src="formData.cover" class="mt-2 max-w-2xs" alt="封面预览" />
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
              <Button :disabled="isLoading" type="submit"> 确认发布 </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
    <v-md-editor v-model="formData.markdown_content" left-toolbar="undo redo | image link code hr bold italic strikethrough quote  tip " height="45rem" @save="handleSave('保存成功')" />
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
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { addBlog } from '@/api/blog';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const editDisabled = ref(true);
const timeInterval = ref(60);
const formData = ref({
  title: '',
  markdown_content: '',
  category: '',
  cover: '',
  coverType: '',
  coverName: '',
});
let timer = '';
const isLoading = ref(false);
const open = ref(false);

onMounted(() => {
  // 从本地存储中读取数据
  for (const key in formData.value) {
    formData.value[key] = localStorage.getItem(key) ??  '';
  }

  timer = setInterval(() => {
    handleSave('自动保存成功');
  }, timeInterval.value * 1000);
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
  if (formData.value.markdown_content === '') {
    toast.warning('内容不能为空');
    return;
  }
  if (formData.value.category === '') {
    toast.warning('分类不能为空');
    return;
  }
  if (formData.value.cover === '') {
    toast.warning('封面不能为空');
    return;
  }

  isLoading.value = true;
  const { title, markdown_content, category, cover, coverType, coverName } = formData.value;
  const file = new File([cover], coverName, { type: coverType });
  addBlog({ title, markdown_content, category }, file).then((res) => {
    isLoading.value = false;
    open.value = false;
    clearSaveBlog(res.message + '，缓存已清空');
  });
};

const confirmTimeInterval = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    handleSave('自动保存成功');
  }, timeInterval.value * 1000);
  toast.success('时间间隔已修改为' + timeInterval.value + '秒');
  editDisabled.value = true;
};
const editTimeInterval = (val) => {
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
  formData.value.coverName = file.name;

  // 读取文件为base64
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target.result;
    formData.value.cover = base64;
    console.log(base64);
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

const clearSaveBlog = (msg = '缓存已清空') => {
  formData.value = {
    title: '',
    markdown_content: '',
    category: '',
    cover: '',
    coverType: '',
    coverName: '',
  };
  for (const key in formData.value) {
    localStorage.removeItem(key);
  }
  toast.success(msg);
};
</script>

<style lang="scss" scoped></style>
