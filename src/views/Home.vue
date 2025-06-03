<template>
  <div v-if="showSplash" class="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
    <div class="flex space-x-8">
      <div v-for="(letter, letterIdx) in letters" :key="letterIdx" class="relative">
        <svg width="100" height="140" viewBox="0 0 100 140">
          <Motion
            v-for="(stroke, strokeIdx) in letter.strokes"
            :key="strokeIdx"
            :initial="{ strokeDashoffset: stroke.length, opacity: 1 }"
            :animate="{
              strokeDashoffset: 0,
              opacity: 1,
              transition: {
                duration: 2,
                ease: 'easeOut'
              }
            }"
            as="path"
            :d="stroke.path"
            fill="none"
            :stroke="letter.color"
            stroke-width="6"
            stroke-linecap="round"
            :style="{
              strokeDasharray: stroke.length,
              strokeDashoffset: stroke.length
            }"
          />
        </svg>
      </div>
    </div>
    <div class="mt-8 text-gray-400 text-sm">下滑进入</div>
  </div>
  <div v-else>
    <!-- <HeaderBanner /> -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-7 gap-6">
        <!-- 左侧边栏（添加ref） -->
        <aside ref="leftAside" class="lg:col-span-2 space-y-6">
          <!-- 头像卡片 -->
          <Card class="text-center gap-2 p-0 overflow-hidden">
            <div class="head h-32 flex items-center relative">
              <Avatar class="w-22 h-22 rounded-full mx-auto absolute left-4 -bottom-10 box-content border-5 border-gray-100">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback>KX</AvatarFallback>
              </Avatar>
              <p class="absolute text-2xl text-white font-bold left-40 bottom-6">KaiXuan</p>
            </div>
            <div class="foot p-4 w-full flex items-center justify-center gap-2">
              <p>生活就是在米缸里种玫瑰🌹</p>
              <div class="flex w-full flex-wrap gap-1 items-center justify-center">
                <div class="bg-[#95B2FF] text-white py-1 px-2 rounded-md text-xs cursor-pointer" v-for="(tag, index) in skillList" :key="index">#{{ tag }}</div>
              </div>
            </div>
          </Card>

          <div class="space-y-2">
            <Card class="p-4 px-6 items-center">
              <AudioPlayer :song="song" @change="changeSong" />
            </Card>

            <NextHoliday class="h-30" />

            <div class="flex items-start justify-center gap-2 h-40">
              <WeatherReport class="h-full" />
              <WorkTimeProgress :size="90" :strokeWidth="10" class="h-full" />
            </div>
          </div>
        </aside>

        <!-- 主内容区（添加ref） -->
        <TransitionGroup name="card" tag="div" ref="mainContent" class="lg:col-span-5 space-y-4" appear>
          <BlogCard
            v-for="(blog, index) in blogs"
            :key="blog.id"
            @click="openDialog(index)"
            class="card cursor-pointer hover:shadow-md"
            :title="blog.title"
            :cover_image="blog.cover_image"
            :author="blog.author"
            :update_time="blog.update_time"
            :category="blog.category"
            :style="{ '--delay': `${index * 0.1 + 0.2}s` }"
          />
        </TransitionGroup>
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" @closeDialog="closeDialog" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import BlogCard from '@/components/myComponents/BlogCard.vue';
import AudioPlayer from '@/components/myComponents/AudioPlayer.vue';
import WorkTimeProgress from '@/components/myComponents/WorkTimeProgress.vue';
import WeatherReport from '@/components/myComponents/WeatherReport.vue';
import NextHoliday from '@/components/myComponents/NextHoliday.vue';
import BlogDialog from '@/components/myComponents/BlogDialog.vue';
import HeaderBanner from '@/components/myComponents/HeaderBanner.vue';
import { getBlogList } from '@/api/blog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Motion } from 'motion-v';

gsap.registerPlugin(ScrollTrigger);

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
const blogs = ref([]);
const dialogOpen = ref(false);
const dialogId = ref('');
const leftAside = ref(null);
const mainContent = ref(null);
const skillList = ['HTML', 'CSS', 'JavaScript', 'Vue', 'React', 'Three', 'Element'];

// 每个字母的笔画数据
const letters = [
  // K
  {
    color: '#FF4D4F',
    strokes: [
      { path: 'M30,20 L30,130', length: 110 },
      { path: 'M80,30 L30,75 L80,130', length: 120 }
    ]
  },
  // a
  {
    color: '#FAAD14',
    strokes: [
      { path: 'M90,100 Q90,70 60,70 Q30,70 30,100 Q30,130 60,130 Q90,130 90,100 Z', length: 200 },
      { path: 'M90,70 L90,130', length: 60 }
    ]
  },
  // i
  {
    color: '#40A9FF',
    strokes: [
      { path: 'M50,40 L50,50', length: 10 },
      { path: 'M50,70 L50,120', length: 50 }
    ]
  },
  // X
  {
    color: '#36CFC9',
    strokes: [
      { path: 'M25,30 L75,120', length: 110 },
      { path: 'M75,30 L25,120', length: 110 }
    ]
  },
  // u
  {
    color: '#73D13D',
    strokes: [
      { path: 'M40,70 A20,60 0 0 0 80,70', length: 140 },
      { path: 'M80,70 L80,130', length: 60 }
    ]
  },
  // a
  {
    color: '#9254DE',
    strokes: [
    { path: 'M90,100 Q90,70 60,70 Q30,70 30,100 Q30,130 60,130 Q90,130 90,100 Z', length: 200 },
      { path: 'M90,70 L90,130', length: 60 }
    ]
  },
  // n
  {
    color: '#F759AB',
    strokes: [
      { path: 'M40,70 L40,130', length: 60 },
      { path: 'M40,130 A20,60 0 0 1 80,130', length: 140 }
    ]
  }
];

const showSplash = ref(true);

const handleScroll = (e) => {
  if (window.scrollY > 10) {
    showSplash.value = false;
  }
};
const handleWheel = (e) => {
  if (e.deltaY > 30) {
    showSplash.value = false;
  }
};

onMounted(() => {
  init();
  // 左侧边栏动画（延迟0.2s）
  animateOnScroll(leftAside.value, 0.2);
  window.addEventListener('wheel', handleWheel);
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('scroll', handleScroll);
});

// 定义通用动画函数
const animateOnScroll = (element, delay = 0.3, stagger = 0.1) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom', // 元素顶部进入视口底部时触发
      end: 'bottom top',
      scrub: false,
      once: false,
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    delay,
    stagger,
    ease: 'power2.out',
  });
};

function init() {
  changeSong(0);
  getBlogList().then((res) => {
    blogs.value = res.data;
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
  background: url('/avatar-bg.jpg');
  background-size: cover;
  z-index: -1;
  transform: skewY(-4deg);
  transform-origin: 0 0;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.card-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.card {
  transition: opacity 0.3s ease, transform 0.3s ease;
  transition-delay: var(--delay);
}
</style>
