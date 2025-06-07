<template>
  <div>
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
                <img src="/kaofish.webp" class="h-full w-full rounded-sm" />
              </div>
            </div>
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
            @openDeleteDialog="openDeleteDialog"
            class="card cursor-pointer hover:shadow-md"
            :title="blog.title"
            :cover_image="blog.cover_image"
            :author="blog.author"
            :update_time="blog.update_time"
            :category="blog.category"
            :id="blog.id"
            :style="{ '--delay': `${index * 0.1 + 0.2}s` }"
          />
        </TransitionGroup>
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" @closeDialog="closeDialog" />
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
import { deleteBlog } from '@/api/blog';
import { toast } from 'vue-sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
const blogs = ref([]);
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const deleteId = ref('');
const dialogId = ref('');
const leftAside = ref(null);
const mainContent = ref(null);
const skillList = ['HTML', 'CSS', 'JavaScript', 'Vue', 'React', 'Three', 'Element'];
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
      getBlogList().then((res) => {
        blogs.value = res.data;
      });
    });
};

onMounted(() => {
  init();
  animateOnScroll(leftAside.value, 0.2);
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
  { src: '/mp3/zrryytjdf.mp3', title: '做讓人远远聽見的風', index: 0 },
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
  background: url('/avatar-bg.webp');
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
