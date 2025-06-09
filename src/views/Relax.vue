<template>
  <div class="max-w-7xl mx-auto">
    <div class="grid w-full lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 p-2 sm:p-4 mx-auto bg-white dark:bg-gray-900">
      <div class="bg-white rounded-lg p-4 shadow-md relative overflow-visible dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700">
        <div class="absolute -top-3 right-4 z-10">
          <span class="inline-block px-3 py-1 text-xs font-bold text-white bg-orange-400 rounded-b-lg shadow">微博</span>
        </div>
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-100">微博热搜榜</h2>
        </div>
        <div class="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
          <div v-for="item in weiboList" :key="item.id" class="flex items-center py-2 border-b border-gray-50 last:border-0 dark:border-gray-700">
            <span
              :class="[
                'w-6 h-6 flex items-center justify-center rounded text-sm mr-2.5',
                item.rank === 1
                  ? 'bg-red-500 text-white'
                  : item.rank === 2
                  ? 'bg-orange-500 text-white'
                  : item.rank === 3
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
              ]"
              >{{ item.rank }}</span
            >
            <a :href="item.url" target="_blank" class="flex-1 text-sm text-gray-700 hover:text-blue-500 truncate dark:text-gray-200 dark:hover:text-blue-400">{{ item.title }}</a>
            <span class="text-xs text-gray-500 ml-2 dark:text-gray-400">{{ formatHeat(item.heat) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-md relative overflow-visible dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700">
        <div class="absolute -top-3 right-4 z-10">
          <span class="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-b-lg shadow">百度</span>
        </div>
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-100">百度热搜榜</h2>
        </div>
        <div class="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
          <div v-for="item in baiduList" :key="item.id" class="flex items-center py-2 border-b border-gray-50 last:border-0 dark:border-gray-700">
            <span
              :class="[
                'w-6 h-6 flex items-center justify-center rounded text-sm mr-2.5',
                item.rank === 1
                  ? 'bg-red-500 text-white'
                  : item.rank === 2
                  ? 'bg-orange-500 text-white'
                  : item.rank === 3
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
              ]"
              >{{ item.rank }}</span
            >
            <a :href="item.url" target="_blank" class="flex-1 text-sm text-gray-700 hover:text-blue-500 truncate dark:text-gray-200 dark:hover:text-blue-400">{{ item.title }}</a>
            <span class="text-xs text-gray-500 ml-2 dark:text-gray-400">{{ formatHeat(item.heat) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-md relative overflow-visible dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700">
        <div class="absolute -top-3 right-4 z-10">
          <span class="inline-block px-3 py-1 text-xs font-bold text-white bg-pink-500 rounded-b-lg shadow">B站</span>
        </div>
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-100">B站热门榜</h2>
        </div>
        <div class="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
          <div v-for="item in bilibiliList" :key="item.id" class="flex items-center py-2 border-b border-gray-50 last:border-0 dark:border-gray-700">
            <span
              :class="[
                'w-6 h-6 flex items-center justify-center rounded text-sm mr-2.5',
                item.rank === 1
                  ? 'bg-red-500 text-white'
                  : item.rank === 2
                  ? 'bg-orange-500 text-white'
                  : item.rank === 3
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
              ]"
              >{{ item.rank }}</span
            >
            <a :href="item.url" target="_blank" class="flex-1 text-sm text-gray-700 hover:text-blue-500 truncate dark:text-gray-200 dark:hover:text-blue-400">{{ item.title }}</a>
            <span class="text-xs text-gray-500 ml-2 dark:text-gray-400">{{ formatHeat(item.heat) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full mt-4">
      <!-- <EchartsRank /> -->
    </div>
    <!-- 开发中... -->
    <div class="w-full mt-4 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="mr-2" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="12" cy="12" r="3" fill="#ccc" />
          <path
            d="M19.4 13c.04-.33.06-.66.06-1s-.02-.67-.06-1l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.03 7.03 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65a7.03 7.03 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64L4.6 11c-.04.33-.06.66-.06 1s.02.67.06 1l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.54.42 1.12.77 1.73 1l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.38-2.65a7.03 7.03 0 0 0 1.73-1l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64L19.4 13z"
            stroke="#ccc"
            stroke-width="1.5"
            fill="none"
          />
        </g>
      </svg>
      <span class="text-gray-500">开发中...</span>
    </div>
  </div>
</template>

<script setup>
import { getHotSearch } from '@/api/relax';
import { onMounted, ref, computed } from 'vue';
// import { getVtbsFullInfo } from '@/api/vtb';
import EchartsRank from '@/components/myComponents/EchartsRank.vue';

const hotSearchList = ref([]);

const weiboList = computed(() => {
  return hotSearchList.value.filter((item) => item.site === '微博');
});

const baiduList = computed(() => {
  return hotSearchList.value.filter((item) => item.site === '百度');
});

const bilibiliList = computed(() => {
  return hotSearchList.value.filter((item) => item.site === 'B站');
});

// 格式化热度显示
const formatHeat = (heat) => {
  if (!heat) return '';
  const heatArray = heat.split(' ');
  if (heatArray.length > 1) {
    return formatHeat(heatArray[heatArray.length - 1]);
  }
  if (heat >= 10000) {
    return '🔥' + (heat / 10000).toFixed(1) + '万';
  }
  if (heat >= 1000) {
    return '🔥' + (heat / 1000).toFixed(1) + '千 ';
  }
  return '🔥' + heat;
};

const getHotSeachList = () => {
  getHotSearch().then((res) => {
    hotSearchList.value = res.data;
  });
};

// const vtbsInfo = ref([]);
// const getVtbs = () =>{
//   getVtbsFullInfo().then((res) => {
//     vtbsInfo.value = res.data;
//   })
// }

onMounted(async () => {
  getHotSeachList();
  // getVtbs();
});
</script>

<style>
/* 自定义滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background: #f3f4f6;
}

/* 暗黑模式下滚动条 */
.dark .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
  background: #374151;
}

.dark .scrollbar-track-gray-800::-webkit-scrollbar-track {
  background: #1f2937;
}
</style>
