<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid lg:grid-cols-12 gap-6">
      <!-- 左侧边栏（添加ref） -->
      <aside ref="leftAside" class="lg:col-span-3 space-y-6">
        <!-- 头像卡片 -->
        <Card class="p-6 text-center gap-2">
          <Avatar class="w-24 h-24 rounded-full mx-auto mb-2">
            <AvatarImage src="/avatar.png" alt="Avatar" />
            <AvatarFallback>KX</AvatarFallback>
          </Avatar>
          <h2 class="text-xl font-bold">KaiXuanXuan</h2>
          <p class="text-gray-600">Stay hungry, stay foolish</p>
        </Card>

        <!-- 音乐播放器 -->
        <Card class="p-4 px-6 items-center">
          <AudioPlayer :song="song" @change="changeSong" />
        </Card>

        <!-- 日历 -->
        <Card class="items-center">
          <Calendar v-model="todayValue" :weekday-format="'short'" />
        </Card>
      </aside>

      <!-- 主内容区（添加ref） -->
      <main ref="mainContent" class="lg:col-span-7 space-y-4">
        <BlogCard
          v-for="(blog, index) in blogs"
          :key="index"
          @click="openDialog(index)"
          class="card cursor-pointer"
          :title="blog.title"
          :cover="blog.cover"
          :author="blog.author"
          :update_time="blog.update_time"
          :category="blog.category"
        />
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" @closeDialog="closeDialog" />
      </main>

      <!-- 右侧边栏（添加ref） -->
      <aside ref="rightAside" class="lg:col-span-2 space-y-6">
        <!-- 下班时间 -->
        <WorkTimeProgress />
        <WeatherReport />
      </aside>
    </div>
  </div>
</template>
<script setup>
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ref, computed, onMounted } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import BlogCard from '@/components/myComponents/BlogCard.vue';
import AudioPlayer from '@/components/myComponents/AudioPlayer.vue';
import WorkTimeProgress from '@/components/myComponents/WorkTimeProgress.vue';
import WeatherReport from '@/components/myComponents/WeatherReport.vue';
import BlogDialog from '@/components/myComponents/BlogDialog.vue';
import { getBlogList } from '@/api/blog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
const blogs = ref([]);
const dialogOpen = ref(false);
const dialogId = ref('');
const leftAside = ref(null);
const mainContent = ref(null);
const rightAside = ref(null);

onMounted(() => {
  init();
  // 左侧边栏动画（延迟0.2s）
  animateOnScroll(leftAside.value, 0.2);
  // 右侧边栏动画（延迟0.4s）
  animateOnScroll(rightAside.value, 0.4);
});

// 定义通用动画函数
const animateOnScroll = (element, delay = 0, stagger = 0.1) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom', // 元素顶部进入视口底部时触发
      end: 'bottom top',
      scrub: false,
      once: true, // 只播放一次
    },
    y: 50, // 初始Y轴偏移50px（下方）
    opacity: 0,
    duration: 0.8,
    delay,
    stagger,
    ease: 'power2.out',
  });
};

function init() {
  changeSong(0);
  getBlogList().then((res) => {
    blogs.value = res.data;
    // 主内容区BlogCard逐个动画（延迟递增）
    const blogCards = computed(() => mainContent.value.querySelectorAll('.card'));
    animateOnScroll(blogCards.value, 0.2);
  });
}

const openDialog = (index) => {
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
  { src: '/mp3/Underground.mp3', title: 'Underground', index: 0 },
  { src: '/mp3/Die_For_You.mp3', title: 'Die For You', index: 1 },
];
</script>
<style scoped></style>
