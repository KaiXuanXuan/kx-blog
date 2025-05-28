<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid lg:grid-cols-12 gap-6">
      <!-- 左侧边栏 -->
      <aside class="lg:col-span-3 space-y-6">
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

      <!-- 主内容区 -->
      <main class="lg:col-span-7 space-y-4">
        <BlogCard
          v-for="(blog, index) in blogs"
          :key="index"
          @click="openDialog(index)"
          class="cursor-pointer hover:shadow-lg hover:scale-101 transition-all duration-500"
          :title="blog.title"
          :cover="blog.cover"
          :author="blog.author"
          :update_time="blog.update_time"
          :category="blog.category"
        />
        <BlogDialog :dialogOpen="dialogOpen" :dialogId="dialogId" @closeDialog="closeDialog" />
      </main>

      <!-- 右侧边栏 -->
      <aside class="lg:col-span-2 space-y-6">
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

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
const dialogOpen = ref(false);
const dialogId = ref('');

function init() {
  changeSong(0);
}

const openDialog = (index) => {
  dialogOpen.value = true;
  dialogId.value = blogs[index].id;
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

const blogs = [
  {
    title: 'Vue3最佳实践',
    update_time: '2024-03-20',
    author: 'KaiXuanXuan',
    cover: '/blog1.jpg',
    category: '前端开发',
    id: '1',
  },
  {
    title: '测试项目2',
    update_time: '2025-03-21',
    author: 'KaiXuan',
    cover: '/blog1.jpg',
    category: '测试',
    id: '2',
  },
];

init();
</script>
<style scoped></style>
