<template>
  <div class="space-y-4">
    <div class="w-full rounded-lg">{{ song.title }}</div>
    <audio ref="audioEl"></audio>
    <!-- 播放进度条 -->
    <input
      type="range"
      min="0"
      :max="duration"
      step="0.1"
      :value="currentTime"
      @input="(e) => (currentTime = parseFloat(e.target.value))"
      style="--w: 100%; --s: 1rem; --g: 0.2rem; --l: 0.3rem; --c: lightBlue"
    />
    <!-- 按钮 -->
    <div class="flex items-center justify-center space-x-4 h-8">
      <Button class="size-8 rounded-full" @click="changeSong(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
          />
        </svg>
      </Button>
      <Button class="size-8 rounded-full" @click="playing = !playing">
        <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      </Button>
      <Button class="size-8 rounded-full" @click="changeSong(1)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
          />
        </svg>
      </Button>
      <Button class="size-8 rounded-full" @click="toggleMute">
        <svg v-if="isMuted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
      </Button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="(e) => (volume = parseFloat(e.target.value))"
        :disabled="isMuted"
        style="--w: 100%; --s: 0.8rem; --g: 0.1rem; --l: 0.2rem; --c: lightBlue"
      />
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'; // 引入Button组件
import { ref, computed, watchEffect } from 'vue';
import { useMediaControls } from '@vueuse/core';

const audioEl = ref(null);
const { playing, currentTime, duration, volume } = useMediaControls(audioEl);
volume.value = 0.25; // 初始音量设为0.25

const progress = computed(() => (currentTime.value / duration.value) * 100);
const volumePercentage = computed(() => `${Math.round(volume.value * 100)}%`);

const isMuted = ref(false);
const lastVolume = ref(1);

function toggleMute() {
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    lastVolume.value = volume.value;
    volume.value = 0;
  } else {
    volume.value = lastVolume.value;
  }
}

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['change']);

function changeSong(direction) {
  const { index } = props.song;
  const newIndex = Number(index) + direction;
  emits('change', newIndex);
}

watchEffect(() => {
  if (props.song?.src && audioEl.value) {
    audioEl.value.src = props.song.src;
  }
});
</script>

<style scoped>
input {
  --c: orange; /* active color */
  --g: 8px; /* the gap */
  --l: 5px; /* line thickness*/
  --s: 30px; /* thumb size*/
  --w: 400px; /* width */

  width: var(--w);
  height: var(--s); /* needed for Firefox*/
  --_c: color-mix(in srgb, var(--c), #ffffff var(--p, 0%));
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  cursor: pointer;
  overflow: hidden;
}
input:focus-visible,
input:hover {
  --p: 25%;
}
input:active,
input:focus-visible {
  --_b: var(--s);
}
/* chromium */
input[type='range' i]::-webkit-slider-thumb {
  height: var(--s);
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 calc(100vw + var(--g));
  -webkit-appearance: none;
  appearance: none;
  transition: 0.3s;
}
/* Firefox */
input[type='range']::-moz-range-thumb {
  height: var(--s);
  width: var(--s);
  background: none;
  border-radius: 50%;
  box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 calc(100vw + var(--g));
  -moz-appearance: none;
  appearance: none;
  transition: 0.3s;
}
@supports not (color: color-mix(in srgb, red, red)) {
  input {
    --_c: var(--c);
  }
}
</style>
