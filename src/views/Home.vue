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
        <ArticleCard v-for="(article, index) in articles" :key="index" :title="article.title" :summary="article.summary" :date="article.date" :cover="article.cover" />
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
import ArticleCard from '@/components/myComponents/ArticleCard.vue';
import AudioPlayer from '@/components/myComponents/AudioPlayer.vue';
import WorkTimeProgress from '@/components/myComponents/WorkTimeProgress.vue';
import WeatherReport from '@/components/myComponents/WeatherReport.vue';

const todayValue = ref(today(getLocalTimeZone()));
const song = ref({});
function init() {
  changeSong(0);
}
function changeSong(index) {
  if (index < 0 || index > songList.length - 1) return;
  song.value = songList[index];
  console.log(song.value);
}

const songList = [
  { src: '/mp3/Underground.mp3', title: 'Underground', index: 0 },
  { src: '/mp3/Die_For_You.mp3', title: 'Die For You', index: 1 },
];

const articles = [
  {
    title: 'Vue3最佳实践',
    summary: '深度解析Vue3组合式API的使用技巧...',
    date: '2024-03-20',
    cover: '/article1.png',
  },
  {
    title: 'Tailwind技巧',
    summary: '掌握Tailwind高级布局与响应式设计...',
    date: '2024-03-19',
    cover: '/article2.png',
  },
  {
    title: 'Tailwind技巧',
    summary: '掌握Tailwind高级布局与响应式设计...',
    date: '2024-03-19',
    cover: '/article3.png',
  },
  // {
  //   title: 'Tailwind技巧',
  //   summary: '掌握Tailwind高级布局与响应式设计...',
  //   date: '2024-03-19',
  //   cover: '/article4.png',
  // },
  // {
  //   title: 'Tailwind技巧',
  //   summary: '掌握Tailwind高级布局与响应式设计...',
  //   date: '2024-03-19',
  //   cover: '/article4.png',
  // },
];

init();
</script>
<style scoped></style>
