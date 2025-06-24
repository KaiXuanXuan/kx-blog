<template>
  <div class="bg-black fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden">
    <div class="splash-bg"></div>
    <div ref="titleGroupRef" class="flex flex-col items-center relative z-10">
      <div class="flex space-x-6">
        <div v-for="(letter, letterIdx) in letters" :key="letterIdx" class="relative">
          <svg width="100" height="140" viewBox="0 0 100 200">
            <defs>
              <linearGradient :id="`stroke-gradient-${letterIdx}`" x1="0" y1="200" x2="100" y2="0" gradientUnits="userSpaceOnUse">
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
      <div class="mt-4 text-lg font-bold text-gray-200 tracking-wide">「前端开发者 —— 凯旋」</div>
    </div>
    <div class="mt-12 text-gray-400 text-sm relative z-10 transition-opacity duration-300" :style="{ opacity: canEnter ? 1 : 0 }">下滑进入</div>
    <svg class="mx-auto mt-2 animate-bounce relative z-10 transition-opacity duration-300" :style="{ opacity: canEnter ? 1 : 0 }" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 12l8 8 8-8" stroke="#aaa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Motion } from 'motion-v';

const router = useRouter();

const letters = [
  {
    gradient: ['#7a5cff', '#bbaaff'],
    strokes: [
      { path: 'M0,0 L0,200', length: 200 },
      { path: 'M100,0 L5,100 L100,200', length: 300 },
    ],
  },
  { gradient: ['#8a73f3', '#e0d7ff'], strokes: [{ path: 'M0,200 L50,0 L100,200', length: 450 }] },
  { gradient: ['#a18cd1', '#ede6ff'], strokes: [{ path: 'M50,0 L50,200', length: 200 }] },
  {
    gradient: ['#b39ddb', '#f5f5fd'],
    strokes: [
      { path: 'M0,0 L100,200', length: 250 },
      { path: 'M100,0 L0,200', length: 250 },
    ],
  },
  { gradient: ['#c5b6e0', '#f5f5fd'], strokes: [{ path: 'M0,0 L0,145 A45,45 0 0 0 100,145 L100,0', length: 460 }] },
  { gradient: ['#d1c4e9', '#f5f5fd'], strokes: [{ path: 'M0,200 L50,0 L100,200', length: 450 }] },
  { gradient: ['#e0d7ff', '#ffffff'], strokes: [{ path: 'M0,200 L0,55 A45,45 0 0 1 100,55 L100,200', length: 460 }] },
];

const titleGroupRef = ref(null);

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let animationFrameId = null;

const canEnter = ref(false);

let dragStartY = null;
let dragging = false;

const handleMouseMove = (e) => {
  // 以窗口中心为原点，计算鼠标偏移，最大偏移量20px
  const { innerWidth, innerHeight } = window;
  const maxOffset = 8;
  const offsetX = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * maxOffset;
  const offsetY = ((e.clientY - innerHeight / 2) / (innerHeight / 2)) * maxOffset;
  targetX = offsetX;
  targetY = offsetY;
};

const animate = () => {
  // 阻尼系数，越小越"黏"
  const damping = 0.1;
  currentX += (targetX - currentX) * damping;
  currentY += (targetY - currentY) * damping;
  if (titleGroupRef.value) {
    titleGroupRef.value.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
  animationFrameId = requestAnimationFrame(animate);
};

const handleEnter = () => {
  if (canEnter.value) {
    router.replace('/home');
  }
};

const handleMouseDown = (e) => {
  if (!canEnter.value) return;
  dragStartY = e.clientY;
  dragging = true;
};

const handleMouseUp = (e) => {
  if (!canEnter.value || !dragging) return;
  const dragDistance = e.clientY - dragStartY;
  if (Math.abs(dragDistance) > 80) {
    handleEnter();
  }
  dragging = false;
  dragStartY = null;
};

const handleMouseLeave = () => {
  dragging = false;
  dragStartY = null;
};

onMounted(() => {
  setTimeout(() => {
    canEnter.value = true;
    window.addEventListener('wheel', handleEnter);
    window.addEventListener('scroll', handleEnter);
    window.addEventListener('touchmove', handleEnter);
  }, 2000);

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mouseleave', handleMouseLeave);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleEnter);
  window.removeEventListener('scroll', handleEnter);
  window.removeEventListener('touchmove', handleEnter);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('mouseleave', handleMouseLeave);
  cancelAnimationFrame(animationFrameId);
});
</script>
<style scoped>
.splash-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('/splash.webp') center/cover no-repeat;
  filter: brightness(0.3) blur(2px);
  pointer-events: none;
}
</style>
