<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden">
    <div class="splash-bg"></div>
    <div class="flex space-x-12 relative z-10">
      <div v-for="(letter, letterIdx) in letters" :key="letterIdx" class="relative">
        <svg width="100" height="140" viewBox="0 0 100 200">
          <defs>
            <linearGradient
              :id="`stroke-gradient-${letterIdx}`"
              x1="0" y1="200" x2="100" y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" :stop-color="letter.gradient[0]" />
              <stop offset="100%" :stop-color="letter.gradient[1]" />
            </linearGradient>
          </defs>
          <Motion
            v-for="(stroke, strokeIdx) in letter.strokes"
            :key="strokeIdx"
            :initial="{ strokeDashoffset: stroke.length, opacity: 1 }"
            :animate="{
              strokeDashoffset: 0,
              opacity: 1,
              transition: {
                duration: 2,
                ease: 'easeOut',
              },
            }"
            as="path"
            :d="stroke.path"
            fill="none"
            :stroke="`url(#stroke-gradient-${letterIdx})`"
            stroke-width="10"
            stroke-linecap="round"
            :style="{
              strokeDasharray: stroke.length,
              strokeDashoffset: stroke.length,
            }"
          />
        </svg>
      </div>
    </div>
    <div class="mt-12 text-gray-400 text-sm relative z-10">下滑进入</div>
    <svg
      class="mx-auto mt-2 animate-bounce relative z-10"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M8 12l8 8 8-8"
        stroke="#aaa"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Motion } from 'motion-v';

const router = useRouter();

const letters = [
  { gradient: ['#7a5cff', '#bbaaff'], strokes: [ { path: 'M0,0 L0,200', length: 200 }, { path: 'M100,0 L5,100 L100,200', length: 300 } ] },
  { gradient: ['#8a73f3', '#e0d7ff'], strokes: [ { path: 'M0,200 L50,0 L100,200', length: 450 } ] },
  { gradient: ['#a18cd1', '#ede6ff'], strokes: [ { path: 'M50,0 L50,200', length: 200 } ] },
  { gradient: ['#b39ddb', '#f5f5fd'], strokes: [ { path: 'M0,0 L100,200', length: 250 }, { path: 'M100,0 L0,200', length: 250 } ] },
  { gradient: ['#c5b6e0', '#f5f5fd'], strokes: [ { path: 'M0,0 L0,145 A45,45 0 0 0 100,145 L100,0', length: 460 } ] },
  { gradient: ['#d1c4e9', '#f5f5fd'], strokes: [ { path: 'M0,200 L50,0 L100,200', length: 450 } ] },
  { gradient: ['#e0d7ff', '#ffffff'], strokes: [ { path: 'M0,200 L0,55 A45,45 0 0 1 100,55 L100,200', length: 460 } ] },
];

const handleEnter = () => {
  router.replace('/home');
};

onMounted(() => {
  window.addEventListener('wheel', handleEnter);
  window.addEventListener('scroll', handleEnter);
  window.addEventListener('touchmove', handleEnter);
});
</script>
<style scoped>
.splash-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
  filter: brightness(0.3) blur(2px);
  pointer-events: none;
}
</style> 