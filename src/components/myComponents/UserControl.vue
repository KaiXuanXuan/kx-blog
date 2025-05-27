<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger class="flex items-center h-8"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{{ userInfo.username ?? '用户' }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="logout" class="cursor-pointer">登出</DropdownMenuItem>
        <DropdownMenuItem @click="changePassword" class="cursor-pointer">修改密码</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog v-model:open="open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!form.isFieldDirty">
            <FormItem v-auto-animate>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input type="text" placeholder="请输入用户名" v-bind="componentField" autocomplete="username" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="oldPassword" :validate-on-blur="!form.isFieldDirty">
            <FormItem v-auto-animate>
              <FormLabel>旧密码</FormLabel>
              <FormControl>
                <Input type="password" placeholder="请输入旧密码" v-bind="componentField" autocomplete="current-password" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="newPassword" :validate-on-blur="!form.isFieldDirty">
            <FormItem v-auto-animate>
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <Input type="password" placeholder="请输入新密码" v-bind="componentField" autocomplete="off" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <DialogFooter class="flex justify-start">
            <Button type="submit" class="w-full"> 确认修改 </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLoginStore } from '@/stores/login.js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { updatePassword } from '@/api/user';
import * as z from 'zod';

const userStore = useLoginStore();
const { userInfo } = storeToRefs(userStore);
const open = ref(false);

const formSchema = toTypedSchema(
  z
    .object({
      username: z.string({ required_error: '用户名不能为空' }).min(2, { message: '用户名至少需要2个字符' }).max(10, { message: '用户名最多10个字符' }),
      oldPassword: z.string({ required_error: '旧密码不能为空' }).min(6, { message: '密码至少需要6位' }).max(20, { message: '密码最多20位' }),
      newPassword: z.string({ required_error: '新密码不能为空' }).min({ message: '密码至少需要6位' }).max(20, { message: '密码最多20位' }),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: '新密码不能与旧密码相同',
      path: ['newPassword'], // 将错误关联到 newPassword 字段
    })
    .refine((data) => data.username === userInfo.value.username,{
      message: '请确保用户名与当前用户一致',
      path: ['username'],
    })
);

const form = useForm({
  validationSchema: formSchema,
});

const logout = () => {
  userStore.clearLogin();
  userStore.clearUserInfo();

  // 清除缓存token
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('id');

  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('id');
};

const changePassword = () => {
  open.value = true;
};

const onSubmit = form.handleSubmit((values) => {
  updatePassword(values).then((res) => {
    if (res.code === 200) {
      toast.success('修改密码成功', {
        description: '请重新登录',
      });
      open.value = false;

      logout();
    }
  });
});
</script>
