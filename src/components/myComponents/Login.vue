<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child> <button class="sm:px-4 sm:py-1 px-1 py-0.5 rounded-md bg-linear-to-r from-cyan-500 to-blue-500 text-white cursor-pointer">登录</button> </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>登录</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!form.isFieldDirty">
          <FormItem v-auto-animate>
            <FormLabel>用户名</FormLabel>
            <FormControl>
              <Input type="text" placeholder="请输入用户名" v-bind="componentField" autocomplete="username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!form.isFieldDirty">
          <FormItem v-auto-animate>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input type="password" placeholder="请输入密码" v-bind="componentField" autocomplete="current-password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="autoLogin">
          <FormItem v-auto-animate>
            <FormControl>
              <div class="flex items-center space-x-2">
                <Checkbox type="checkbox" v-model="autoLogin" />
                <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">自动登录</span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter class="flex justify-start">
          <Button type="submit" class="w-full"> 登录 </Button>
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'vue-sonner';
import { ref } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { login } from '@/api/user';
import { useLoginStore } from '@/stores/login';
import * as z from 'zod';

const open = ref(false);
const autoLogin = ref(false);

const formSchema = toTypedSchema(
  z.object({
    username: z.string({ required_error: '用户名不能为空' }).min(2, { message: '用户名至少需要2个字符' }).max(10, { message: '用户名最多10个字符' }),
    password: z.string({ required_error: '密码不能为空' }).min(6, { message: '密码至少需要6位' }).max(20, { message: '密码最多20位' }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const toastMessage = (username, message = '登录成功') => {
  toast.success(message, {
    description: `欢迎回来：${username}`,
  });
};

const onSubmit = form.handleSubmit((values) => {
  login(values).then((res) => {
    if (res.code === 200) {
      const { message } = res;
      const { id, token, username } = res.data;
      // 根据自动登录状态选择存储方式
      const storage = autoLogin.value ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('username', username);
      storage.setItem('id', id);
      // 设置登录状态
      const loginStore = useLoginStore();
      loginStore.setLogin(true);
      loginStore.setUserInfo({ username, id });
      // 显示登陆成功消息
      toastMessage(username, message);
      open.value = false;
    }
  });
});
</script>

<style lang="scss" scoped></style>
