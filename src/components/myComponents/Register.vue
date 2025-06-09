<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child @click="console.log(open)">
      <button class="sm:px-4 sm:py-1 px-1 py-0.5 rounded-md bg-white border border-blue-200 text-blue-400 hover:bg-blue-50 dark:border-0 dark:bg-gray-600 dark:text-white cursor-pointer">注册</button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>注册</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!form.isFieldDirty">
          <FormItem v-auto-animate>
            <FormLabel>用户名</FormLabel>
            <FormControl>
              <Input type="text" placeholder="请输入用户名" v-bind="componentField" autocomplete="username" />
            </FormControl>
            <FormDescription>用户名在2~10字之间</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!form.isFieldDirty">
          <FormItem v-auto-animate>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input type="password" placeholder="请输入密码" v-bind="componentField" autocomplete="current-password" />
            </FormControl>
            <FormDescription>密码在6~20位之间</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter class="flex justify-start">
          <Button type="submit" class="w-full"> 注册 </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'vue-sonner';
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { register } from '@/api/user';
import { useLoginStore } from '@/stores/login';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const open = ref(false);

const formSchema = toTypedSchema(
  z.object({
    username: z.string({ required_error: '用户名不能为空' }).min(2, { message: '用户名至少需要2个字符' }).max(10, { message: '用户名最多10个字符' }),
    password: z.string({ required_error: '密码不能为空' }).min(6, { message: '密码至少需要6位' }).max(20, { message: '密码最多20位' }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const toastMessage = (username, message = '注册成功') => {
  toast.success(message, {
    description: `欢迎回来：${username}`,
  });
};

const onSubmit = form.handleSubmit((values) => {
  register(values).then((res) => {
    if ((res.code == 200)) {
      const { message } = res;
      const { id, token, username } = res.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('id', id);

      const loginStore = useLoginStore();
      loginStore.setLogin(true);
      loginStore.setUserInfo({ username, id });

      open.value = false;
      toastMessage(username, message);
    }
  });
});
</script>

<style lang="scss" scoped></style>
