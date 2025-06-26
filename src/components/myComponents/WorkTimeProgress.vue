<template>
  <div class="space-y-2 w-full">
    <Card class="flex flex-col justify-center items-center gap-2 p-4 h-full">
      <div class="progress-container relative">
        <svg :width="size" :height="size">
          <!-- 背景环 -->
          <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke-width="strokeWidth" stroke="#ddd"
            stroke-linecap="round" :stroke-dasharray="`${circumference}`" />

          <!-- 进度环 -->
          <motion.circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke-width="strokeWidth"
            :stroke="strokeColor" :initial="{ strokeDashoffset: circumference }"
            :animate="{ strokeDasharray: progressDash }" :transition="{ duration: 1.2 }"
            :stroke-dasharray="progressDash" stroke-linecap="round" :style="{ rotate: -90 }" />
        </svg>

        <!-- 文本 -->
        <div
          class="absolute left-[50%] top-[50%] translate-[-50%] text-center text-lg font-medium text-gray-800 dark:text-white">
          {{ Math.floor(localProgress * 100) }}
        </div>
      </div>
      <div class="text-center text-md font-medium text-gray-500 dark:text-gray-200">
        {{ status }}
      </div>
      <div v-if="workFlag == 0" class="text-center text-sm font-medium text-gray-500 dark:text-gray-200">下班：{{
        timeToGo[0] }} 时 {{ timeToGo[1] }} 分</div>
    </Card>

    <Collapsible v-model:open="isOpen" class="w-full">
      <CollapsibleTrigger class="w-full cursor-pointer">
        <Card class="p-1 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </Card>
      </CollapsibleTrigger>
      <!-- 上下班时间设置 -->
      <CollapsibleContent class="mt-2 w-full overflow-hidden">
        <Card class="pb-0 w-full">
          <CardHeader>
            <CardTitle> 设置 </CardTitle>
          </CardHeader>
          <CardContent class="w-full">
            <form class="w-full">
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5 w-full">
                  <NumberField id="goWork" :default-value="goWorkTime" :min="7" :max="12" v-model="goWorkTime" class="w-full">
                    <Label for="goWork">💼上班时间</Label>
                    <NumberFieldContent class="w-full">
                      <NumberFieldDecrement class="cursor-pointer" />
                      <NumberFieldInput class="flex-1 min-w-0" />
                      <NumberFieldIncrement class="cursor-pointer" />
                    </NumberFieldContent>
                  </NumberField>
                  <NumberField id="offWork" :default-value="offWorkTime" :min="16" :max="21" v-model="offWorkTime" class="w-full">
                    <Label for="offWork">🚇下班时间</Label>
                    <NumberFieldContent class="w-full">
                      <NumberFieldDecrement class="cursor-pointer" />
                      <NumberFieldInput class="flex-1 min-w-0" />
                      <NumberFieldIncrement class="cursor-pointer" />
                    </NumberFieldContent>
                  </NumberField>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            <Button variant="outline" @click="isOpen = false"> 取消 </Button>
            <Button @click="confirmWorkTime">确定</Button>
          </CardFooter>
        </Card>
      </CollapsibleContent>
    </Collapsible>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion, useMotionValue } from 'motion-v';
import chineseDays from 'chinese-days';

const props = defineProps({
  size: {
    type: Number,
    default: 120,
  },
  strokeWidth: {
    type: Number,
    default: 12,
  },
});

const localProgress = ref(0);
const goWorkTime = ref(9);
const offWorkTime = ref(18);
const workFlag = ref(3); // -1:上班前  0:上班中   1:下班后   2:放假   3:载入中
const isOpen = ref(false);
const timeToGo = ref(0); // 距离下班时间

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const status = computed(() => {
  switch (workFlag.value) {
    case -1:
      return '⏰要上班了！';
    case 0:
      return '🧑‍💻上班中..';
    case 1:
      return '🏃下班！';
    case 2:
      return '🍹放假中~';
    case 3:
      return '🚌载入中~';
  }
});
const strokeColor = computed(() => {
  switch (workFlag.value) {
    case -1:
      return '#ff9800';
    case 0:
      return '#2196f3';
    case 1:
      return '#2CEAA3';
    case 2:
      return '#ff7b9c';
    case 3:
      return '#ddd';
  }
});

// 进度环参数
const progressDash = computed(() => {
  const currentProgress = localProgress.value;
  const visibleLength = circumference.value * currentProgress;
  return `${visibleLength} ${circumference.value - visibleLength}`;
});

function getLocalstorage (key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
function setLocalstorage (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function confirmWorkTime () {
  setLocalstorage('goWorkTime', goWorkTime.value);
  setLocalstorage('offWorkTime', offWorkTime.value);
  isOpen.value = false;
}

function nowMinutes () {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();

  const seconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds; // 计算当前时间的总秒数
  const minutes = Math.floor(seconds / 60); // 将总秒数转换为分钟数
  return minutes;
}

function formatDate (date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // 补零操作，确保月份和日期都是两位数
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return `${year}-${month}-${day}`;
}

function calcWorkProgress (now, start, end) {
  if (now <= start) {
    workFlag.value = -1;
    return now / start;
  } else if (now >= end) {
    workFlag.value = 1;
    return (now - end) / (24 * 60 - end);
  } else {
    workFlag.value = 0;
    return (now - start) / (end - start);
  }
}
function calcRestProgress (now, start, end) {
  workFlag.value = 2;
  return (now - start) / (end - start);
}

onMounted(() => {
  // 获取下一个节假日
  const now = formatDate(new Date());

  const timer = setInterval(() => {
    if (!isOpen.value) {
      goWorkTime.value = getLocalstorage('goWorkTime') || 9;
      offWorkTime.value = getLocalstorage('offWorkTime') || 18;
    }

    const currentMinutes = nowMinutes();
    const goWorkMinutes = goWorkTime.value * 60;
    const offWorkMinutes = offWorkTime.value * 60;

    if (chineseDays.isWorkday(now)) {
      localProgress.value = calcWorkProgress(currentMinutes, goWorkMinutes, offWorkMinutes);
      timeToGo.value = [Math.floor((offWorkMinutes - currentMinutes) / 60), (offWorkMinutes - currentMinutes) % 60];
    } else {
      localProgress.value = calcRestProgress(currentMinutes, 0, 24 * 60);
    }

    if (localProgress.value >= 1) localProgress.value = 0;
  }, 1000);
  onUnmounted(() => clearInterval(timer));
});
</script>

<style scoped>
</style>
