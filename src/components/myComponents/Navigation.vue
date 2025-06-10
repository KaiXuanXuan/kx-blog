<template>
  <div class="flex justify-between items-center xl:px-35 lg:px-30 md:px-15 sm:px-5 py-2 h-14 w-full">
    <!-- logo -->
    <div class="flex items-center cursor-pointer" @click="handleLogoClick">
      <img src="/logo.webp" alt="logo" class="max-w-8 max-h-8 min-w-2 min-h-2 hidden sm:block" />
      <span class="xl:ml-8 lg:ml-6 md:ml-4 sm:ml-2 font-semibold">
        <span class="hidden sm:block">KX</span>
      </span>
    </div>
    <!-- 导航 -->
    <div class="relative flex items-center 2xl:gap-4 sm:gap-1" ref="navItemsRef" @click="handleNavItemClick">
      <div class="active-overlay rounded-lg" ref="activeOverlay"></div>
      <router-link
        v-for="(link, index) in links"
        :key="link.title"
        :to="link.path"
        class="nav-item relative md:px-6 md:py-2 px-2 py-1 rounded-lg hover:bg-[#6874E8] hover:text-[#E8F0FF] transition-all duration-300"
        :class="{ active: route.path === link.path }"
      >
        <p class="active-text hidden sm:block">{{ link.title }}</p>
        <div
          class="flex items-center justify-center"
          :class="['sm:absolute sm:top-0 sm:left-0 sm:w-full sm:h-full', route.path === link.path ? 'text-[#E8F0FF]' : 'text-black dark:text-white', route.path === link.path ? '' : 'sm:opacity-0']"
        >
          <svg v-if="index == 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <svg v-if="index == 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
          <svg v-if="index == 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
          <svg v-if="index == 3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
            />
          </svg>
          <svg v-if="index == 4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
            />
          </svg>
        </div>
      </router-link>
    </div>
    <!-- 切换主题与用户 -->
    <div class="flex items-center">
      <!-- 登录与注册 -->
      <div v-if="!isLogin" class="flex items-center lg:gap-2 gap-0.5 lg:mr-8 md:mr-4 mr-1 text-sm">
        <Register />
        <Login />
      </div>
      <div v-else class="flex items-center lg:gap-2 gap-0.5 lg:mr-10 md:mr-5 mr-2">
        <Avatar class="md:mr-2 sm:mr-1 mr-0.5 sm:size-8 size-6">
          <AvatarImage src="https://github.com/unovue.png" alt="Avatar" />
          <AvatarFallback>{{ userInfo.username.slice(0, 2) }}</AvatarFallback>
        </Avatar>
        <UserControl />
      </div>
      <!-- 亮暗模式 -->
      <span class="lg:mr-4 md:mr-2 sm:mr-1 mr-0.5">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-6 size-4">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-6 size-4">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </span>
      <DarkLightSwitch @change="debounceSwitch" :size="switchSize" :modelValue="colorMode"></DarkLightSwitch>
    </div>
  </div>
</template>

<script setup>
import DarkLightSwitch from '@/components/myComponents/DarkLightSwitch.vue';
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
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
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const isDark = ref(false);
const navItemsRef = ref(null);
const activeOverlay = ref(null);
const navItemList = ref([]);
const currentIndex = ref(0);
const colorMode = useColorMode();
const loginStore = useLoginStore();
const { isLogin, userInfo } = storeToRefs(loginStore);
const route = useRoute();

const links = routes.slice(1, 6).map((route) => {
  return {
    title: route.meta.title,
    path: route.path,
  };
});

const switchSize = ref(1.5);

const handleLogoClick = () => {
  router.push('/');
}

const updateSwitchSize = () => {
  if (window.innerWidth < 768) {
    // md断点
    switchSize.value = 1.0;
  } else if (window.innerWidth < 640) {
    switchSize.value = 0.8;
  } else {
    switchSize.value = 1.5;
  }
}

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
    const { csrfToken } = res;
    sessionStorage.setItem('csrfToken', csrfToken);
  });
  navItemList.value = navItemsRef.value.querySelectorAll('.nav-item');
  nextTick(() => {
    const activeNav = Array.from(navItemList.value).find((nav) => nav.classList.contains('active'));
    if (activeNav) updateOverlay(activeNav);
  });

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  updateSwitchSize();
  window.addEventListener('resize', updateSwitchSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('resize', updateSwitchSize);
});

const handleResize = () => {
  navItemList.value = navItemsRef.value.querySelectorAll('.nav-item');
  const activeNav = Array.from(navItemList.value).find((nav) => nav.classList.contains('active'));
  if (activeNav) updateOverlay(activeNav);
}

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

const updateOverlay = (target) => {
  const rect = target.getBoundingClientRect();
  const parentRect = target.parentElement.getBoundingClientRect();

  activeOverlay.value.style.width = `${rect.width}px`;
  activeOverlay.value.style.left = `${rect.left - parentRect.left}px`;
}

const handleNavItemClick = (e) => {
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
  background: #6874e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.nav-item.active {
  color: #e8f0ff;
  position: relative;
  z-index: 2;
  font-weight: 600;
}

.active .active-text {
  opacity: 0;
}

.active .active-icon {
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
