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
      <Sheet>
        <SheetTrigger as-child>
          <Button> 发布文章 </Button>
        </SheetTrigger>
        <SheetContent class="p-10">
          <SheetHeader class="p-0 mb-4">
            <SheetTitle> 发布文章 </SheetTitle>
            <SheetDescription>文章一经发布，本地缓存将清空</SheetDescription>
          </SheetHeader>
          <form @submit="onSubmit" class="space-y-4">
            <FormField name="title" :validate-on-blur="!form.isFieldDirty">
              <FormItem v-auto-animate>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input :disabled="editDisabled" type="text" placeholder="请输入标题" v-model="formData.title" autocomplete="off" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="cover" :validate-on-blur="!form.isFieldDirty">
              <FormItem v-auto-animate>
                <FormLabel>封面</FormLabel>
                <FormControl>
                  <Input type="file" autocomplete="off" @change="handleCoverChange" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <SheetFooter class="p-0 mt-8">
              <SheetClose as-child>
                <Button type="submit"> 确认发布 </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
    <v-md-editor v-model="formData.text" left-toolbar="undo redo | image link code hr bold italic strikethrough quote  tip " height="45rem" @save="handleSave"></v-md-editor>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

const editDisabled = ref(false);
const formData = ref({
  title: '',
  text: '',
  category: '',
  cover: null,
});

const formSchema = toTypedSchema(z.object({}));

const form = useForm({
  validationSchema: formSchema,
});

const confirmTile = () => {
  if (!formData.title.value) {
    toast.error('标题不能为空');
    return;
  }
  editDisabled.value = true;
};
const editTitle = (val) => {
  editDisabled.value = false;
};

const handleCoverChange = async (e) => {
  const file = e.target.files[0];

  // 临时保存到响应式数据
  cover.value = arrayBuffer;
};

const handleSave = (val) => {
  // 遍历formData，将所有值都保存到本地存储中
  for (const key in formData.value) {
    localStorage.setItem(key, formData.value[key]);
  }
  toast.success('保存成功');
};
</script>

<style lang="scss" scoped></style>
