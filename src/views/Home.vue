<template>
  <div>
    <!-- <HeaderBanner /> -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-7 gap-6">
        <!-- 左侧边栏（添加ref） -->
        <aside ref="leftAside" class="lg:col-span-2 space-y-6">
          <!-- 头像卡片 -->
          <Card class="text-center gap-2 p-0 overflow-hidden">
            <div class="head h-32 flex items-center relative" fetchpriority="high">
              <Avatar class="w-22 h-22 rounded-full mx-auto absolute left-4 -bottom-10 box-content border-5 border-gray-100">
                <AvatarImage src="/avatar.webp" alt="Avatar" fetchpriority="high" />
                <AvatarFallback>KX</AvatarFallback>
              </Avatar>
              <p class="absolute text-2xl text-white font-bold left-40 bottom-6">KaiXuan</p>
            </div>
            <div class="foot p-4 w-full flex items-center justify-center gap-2 mt-3">
              <p>生活就是在米缸里种玫瑰🌹</p>
              <div class="flex flex-wrap w-full gap-1 items-center justify-center">
                <div class="bg-[#95B2FF] text-white py-1 px-2 rounded-md text-xs cursor-pointer" v-for="(tag, index) in skillList" :key="index">#{{ tag }}</div>
              </div>
            </div>
          </Card>

          <div class="space-y-2">
            <Card class="p-4 px-6 items-center">
              <AudioPlayer :song="song" @change="changeSong" />
            </Card>
            <div class="flex items-center justify-center gap-2">
              <NextHoliday class="h-28" />
              <div class="h-28 w-28 flex-shrink-0">
                <img src="/kaofish.webp" alt="kao fish" class="h-full w-full rounded-sm" loading="lazy" />
              </div>
            </div>
            <div class="flex items-start justify-center gap-2 h-41">
              <WeatherReport class="h-full" />
              <WorkTimeProgress :size="90" :strokeWidth="10" class="h-full" />
            </div>
          </div>
        </aside>

        <!-- 主内容区（添加ref） -->
        <div ref="mainContent" class="lg:col-span-5 space-y-4 lg:mt-0 mt-8 mb-4">
          <!-- 滑到最底部自动加载下一页 -->
          <BlogCard
            v-for="(blog, index) in blogs"
            :key="blog.id"
            @click="openDialog(index)"
            @openDeleteDialog="openDeleteDialog"
            @openEditDialog="openEditDialog"
            class="card cursor-pointer"
            :title="blog.title"
            :cover_image="blog.cover_image"
            :author="blog.author"
            :update_time="blog.update_time"
            :category="blog.category"
            :id="blog.id"
            :style="{ '--delay': `${index * 0.1 + 0.2}s` }"
          />

          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="flex items-center space-x-2 text-gray-500">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#11A8CD]"></div>
              <span>加载中...</span>
            </div>
          </div>

          <!-- 没有更多数据 -->
          <div v-else-if="!hasMore && blogs.length > 0" class="flex justify-center items-center py-8">
            <div class="text-gray-500 text-sm">
              <span>没有更多内容了 ~</span>
            </div>
          </div>
        </div>
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" :mode="dialogMode" @closeDialog="closeDialog" @publishSuccess="handleBlogUpdate" />
        <Dialog v-model:open="deleteDialogOpen">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除</DialogTitle>
              <DialogDescription>确定删除该博客吗？</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
              <Button @click="deleteBlogCard">确认</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ref, computed, onMounted, nextTick, onUnmounted, defineAsyncComponent } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import { getLocalTimeZone, today } from '@internationalized/date';
import BlogCard from '@/components/myComponents/BlogCard.vue';
import BlogDialog from '@/components/myComponents/BlogDialog.vue';
import { getBlogPage } from '@/api/blog';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Motion } from 'motion-v';
import { deleteBlog } from '@/api/blog';
import { toast } from 'vue-sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// import { gsap } from 'gsap';
// gsap.registerPlugin(ScrollTrigger);

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
const blogs = ref([]);
const page = ref({
  current: 1,
  pageSize: 8,
});

const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const deleteId = ref('');
const dialogId = ref('');
const dialogMode = ref('preview');

const leftAside = ref(null);
const mainContent = ref(null);

// 无限滚动相关状态
const isLoading = ref(false);
const hasMore = ref(true);
const isInitialized = ref(false); // 标记是否已初始化完成

const skillList = ['HTML', 'CSS', 'JavaScript', 'Vue', 'React', 'Three', 'Element'];

const resetPage = () => {
  page.value.current = 1;
  page.value.pageSize = 8;
  hasMore.value = true;
  isInitialized.value = false;
};

const getNextPage = async () => {
  if (isLoading.value || !hasMore.value || !isInitialized.value) {
    return;
  }
  isLoading.value = true;
  page.value.current++;
  const res = await getBlogPage(page.value.current, page.value.pageSize);

  if (res.data && res.data.list.length > 0) {
    blogs.value.push(...res.data.list);
    // 如果返回的数据少于pageSize，说明没有更多数据了
    if (res.data.list.length < page.value.pageSize) {
      hasMore.value = false;
    }
  } else {
    hasMore.value = false;
  }

  isLoading.value = false;
};

const getCurrentPage = async () => {
  isLoading.value = true;
  const res = await getBlogPage(page.value.current, page.value.pageSize);
  blogs.value = res.data.list;
  // 标记初始化完成
  isInitialized.value = true;
  isLoading.value = false;
};

const openDeleteDialog = (id) => {
  deleteDialogOpen.value = true;
  deleteId.value = id;
};

const deleteBlogCard = () => {
  deleteBlog(deleteId.value)
    .then((res) => {
      if (res.code === 200) {
        toast.success('删除成功');
      }
    })
    .then(() => {
      deleteDialogOpen.value = false;
      // 重置分页和状态
      blogs.value = [];
      resetPage();
      getCurrentPage();
    });
};

// 使用 @vueuse/core 的无限滚动
useInfiniteScroll(
  window, // 滚动容器（可以是具体元素的ref）
  () => {
    // 滚动到底部时的回调函数
    console.log('触发无限滚动加载');
    getNextPage();
  },
  {
    distance: 100, // 距离底部100px时触发
    canLoadMore: () => {
      const canLoad = isInitialized.value && hasMore.value && !isLoading.value;
      return canLoad;
    }, // 只有初始化完成后才允许加载更多
  }
);

onMounted(() => {
  init();
  // animateOnScroll(leftAside.value, 0.2);
});

// // 定义通用动画函数
// const animateOnScroll = (element, delay = 0.3, stagger = 0.1) => {
//   gsap.from(element, {
//     scrollTrigger: {
//       trigger: element,
//       start: 'top bottom', // 元素顶部进入视口底部时触发
//       end: 'bottom top',
//       scrub: false,
//       once: false,
//     },
//     y: 40,
//     opacity: 0,
//     duration: 0.6,
//     delay,
//     stagger,
//     ease: 'power2.out',
//   });
// };

function init() {
  changeSong(0);
  getCurrentPage();
}

const openEditDialog = (id) => {
  dialogMode.value = 'editor';
  dialogOpen.value = true;
  dialogId.value = String(id);
};

const openDialog = (index) => {
  dialogMode.value = 'preview';
  dialogOpen.value = true;
  dialogId.value = String(blogs.value[index].id);
};

const closeDialog = () => {
  dialogOpen.value = false;
};

function changeSong(index) {
  if (index < 0 || index > songList.length - 1) return;
  song.value = songList[index];
  console.log(song.value);
}

const songList = [
  { src: '/mp3/zrryytjdf.mp3', title: '做让人远远听见的风', index: 0 },
  { src: '/mp3/Die_For_You.mp3', title: 'Die For You', index: 1 },
];

const AudioPlayer = defineAsyncComponent(() => import('@/components/myComponents/AudioPlayer.vue'));
const WorkTimeProgress = defineAsyncComponent(() => import('@/components/myComponents/WorkTimeProgress.vue'));
const WeatherReport = defineAsyncComponent(() => import('@/components/myComponents/WeatherReport.vue'));
const NextHoliday = defineAsyncComponent(() => import('@/components/myComponents/NextHoliday.vue'));

const handleBlogUpdate = (msg) => {
  blogs.value = [];
  resetPage();
  getCurrentPage();
  dialogId.value = '';
};
</script>

<style scoped>
.head {
  position: relative;
  z-index: 1;
}

.head::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  background: url('/avatar-bg.webp');
  background-size: cover;
  z-index: -1;
  transform: skewY(-4deg);
  transform-origin: 0 0;
}
</style>
