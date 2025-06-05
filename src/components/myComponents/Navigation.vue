<template>
  <div class="flex justify-between items-center px-40 py-2 h-14 w-full dark:border-gray-700">
    <!-- logo -->
    <div class="flex items-center">
      <img src="/vite.svg" alt="logo" class="w-8 h-8" />
      <span class="ml-8 font-semibold">个人博客 - 凯旋</span>
    </div>
    <!-- 导航 -->
    <div class="relative flex items-center gap-4" ref="navItemsRef" @click="handleNavItemClick">
      <div class="active-overlay rounded-md" ref="activeOverlay"></div>
      <router-link v-for="link in links" :key="link.title" :to="link.path" class="nav-item px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" :class="{ active: route.path === link.path }">
        {{ link.title }}
      </router-link>
    </div>
    <!-- 切换主题与用户 -->
    <div class="flex items-center">
      <!-- 登录与注册 -->
      <div v-if="!isLogin" class="flex items-center gap-2 mr-8 text-sm">
        <Register />
        <Login />
      </div>
      <div v-else class="flex items-center gap-2 mr-10">
        <Avatar class="mr-2">
          <AvatarImage src="https://github.com/unovue.png" alt="Avatar" />
          <AvatarFallback>{{ userInfo.username.slice(0, 2) }}</AvatarFallback>
        </Avatar>
        <UserControl />
      </div>
      <!-- 亮暗模式 -->
      <span class="mr-4">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </span>
      <DarkLightSwitch @change="debounceSwitch" :size="1.5" :modelValue="colorMode"></DarkLightSwitch>
    </div>
  </div>
</template>

<script setup>
import DarkLightSwitch from '@/components/myComponents/DarkLightSwitch.vue';
import { ref, onMounted, watch, nextTick } from 'vue';
import { useColorMode } from '@vueuse/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Register from '@/components/myComponents/Register.vue';
import Login from '@/components/myComponents/Login.vue';
import UserControl from '@/components/myComponents/UserControl.vue';
import { useLoginStore } from '@/stores/login';
import { storeToRefs } from 'pinia';
import { connect } from '@/api/connect.js';
import { toast } from 'vue-sonner';
import routes from '@/router/routes';
import { useRoute } from 'vue-router';

const isDark = ref(false);
const navItemsRef = ref(null);
const activeOverlay = ref(null);
const navItemList = ref([]);
const currentIndex = ref(0);
const colorMode = useColorMode();
const loginStore = useLoginStore();
const { isLogin, userInfo } = storeToRefs(loginStore);
const route = useRoute();

const links = routes.slice(1).map((route) => {
  return {
    title: route.meta.title,
    path: route.path,
  };
});

onMounted(() => {
  const token = localStorage.getItem('token');
  const tempToken = sessionStorage.getItem('token');

  // 如有token缓存，设置登录状态和用户信息
  if (token || tempToken) {
    loginStore.setLogin(true);
    const username = sessionStorage.getItem('username') || localStorage.getItem('username');
    const id = sessionStorage.getItem('id') || localStorage.getItem('id');
    loginStore.setUserInfo({ username, id });
  }

  // 获取csrfToken
  connect().then((res) => {
    const { csrfToken } = res.data;
    sessionStorage.setItem('csrfToken', csrfToken);
  });
  navItemList.value = navItemsRef.value.querySelectorAll('.nav-item');
  nextTick(() => {
    const activeNav = Array.from(navItemList.value).find((nav) => nav.classList.contains('active'));
    if (activeNav) updateOverlay(activeNav);
  });
});

watch(
  () => route.path,
  () => {
    nextTick(() => {
      navItemList.value = navItemsRef.value.querySelectorAll('.nav-item');
      const activeNav = Array.from(navItemList.value).find((nav) => nav.classList.contains('active'));
      if (activeNav) updateOverlay(activeNav);
    });
  }
);

// 防抖
const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

function updateOverlay(target) {
  const padding = 24; // 匹配 nav-item 的 padding-x
  const rect = target.getBoundingClientRect();
  const parentRect = target.parentElement.getBoundingClientRect();

  activeOverlay.value.style.width = `${rect.width}px`;
  activeOverlay.value.style.left = `${rect.left - parentRect.left}px`;
}

function handleNavItemClick(e) {
  const target = e.target;
  if (!target.classList.contains('nav-item')) return;

  navItemList.value.forEach((nav) => nav.classList.remove('active'));
  target.classList.add('active');
  updateOverlay(target);

  const activeIndex = Array.from(navItemList.value).indexOf(target);
  currentIndex.value = activeIndex;
}

const handleSwitch = (value) => {
  isDark.value = value === 'dark' ? true : false;
  colorMode.value = value;
};

const debounceSwitch = debounce(handleSwitch, 500);
</script>

<style scoped>
/* Active overlay */
.active-overlay {
  position: absolute;
  top: 0;
  height: 100%;
  background: hsla(219, 8%, 52%, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.nav-item.active {
  color: #181c1f;
  position: relative;
  z-index: 2;
  font-weight: 600;
}
</style>
