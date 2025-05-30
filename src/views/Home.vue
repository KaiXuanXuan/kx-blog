<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid lg:grid-cols-7 gap-6">

      <!-- 左侧边栏（添加ref） -->
      <aside ref="leftAside" class="lg:col-span-2 space-y-6">
        <!-- 头像卡片 -->
        <Card class="text-center gap-2 p-0 overflow-hidden">
          <div class="head h-32 flex items-center relative">
            <Avatar
              class=" w-22 h-22 rounded-full mx-auto absolute left-4 -bottom-10 box-content border-5 border-gray-100">
              <AvatarImage src="/avatar.png" alt="Avatar" />
              <AvatarFallback>KX</AvatarFallback>
            </Avatar>
            <p class="absolute text-2xl text-white font-bold left-40 bottom-6">KaiXuan</p>
          </div>
          <div class="foot p-4  w-full flex items-center justify-center gap-2">
            <p>生活就是在米缸里种玫瑰🌹</p>
            <div class="flex w-full flex-wrap gap-1 items-center justify-center">
              <div class="bg-[#95B2FF] text-white py-1 px-2 rounded-md text-xs cursor-pointer"
                v-for="(tag, index) in skillList" :key="index">#{{ tag }}</div>
            </div>
          </div>
        </Card>

        <div class="space-y-2">
          <Card class="p-4 px-6 items-center">
            <AudioPlayer :song="song" @change="changeSong" />
          </Card>
          
          <NextHoliday class="h-30"/>

          <div class="flex items-start justify-center gap-2 h-40">
            <WeatherReport class="h-full" /> 
            <WorkTimeProgress :size="90" :strokeWidth="10" class="h-full"/>
          </div>
        </div>
      </aside>

      <!-- 主内容区（添加ref） -->
      <main ref="mainContent" class="lg:col-span-5 space-y-4">
        <BlogCard v-for="(blog, index) in blogs" :key="index" @click="openDialog(index)"
          class="card cursor-pointer hover:shadow-md" :title="blog.title" :cover_image="blog.cover_image"
          :author="blog.author" :update_time="blog.update_time" :category="blog.category" />
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" @closeDialog="closeDialog" />
      </main>


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
import NextHoliday from '@/components/myComponents/NextHoliday.vue';
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
const skillList = ['HTML', 'CSS', 'JavaScript', 'Vue', 'React', 'Three', 'Element']

onMounted(() => {
  init();
  // 左侧边栏动画（延迟0.2s）
  animateOnScroll(leftAside.value, 0.2);
});

// 定义通用动画函数
const animateOnScroll = (element, delay = 0, stagger = 0.1) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom', // 元素顶部进入视口底部时触发
      end: 'bottom top',
      scrub: false,
      once: false,
    },
    y: 50, // 初始Y轴偏移50px（下方）
    opacity: 0,
    duration: 0.8,
    delay,
    stagger,
    ease: 'power2.out',
  });
};

function init () {
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

function changeSong (index) {
  if (index < 0 || index > songList.length - 1) return;
  song.value = songList[index];
  console.log(song.value);
}

const songList = [
  { src: '/mp3/Underground.mp3', title: 'Underground', index: 0 },
  { src: '/mp3/Die_For_You.mp3', title: 'Die For You', index: 1 },
];
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
  background: url("/avatar-bg.jpg");
  background-size: cover;
  z-index: -1;
  transform: skewY(-4deg);
  transform-origin: 0 0;
}
</style>
