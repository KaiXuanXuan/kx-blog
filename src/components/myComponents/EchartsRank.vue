<template>
  <div>
    <v-chart :option="option" auto-resize :style="{ height: props.height + 'dvh' }" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

const chartRef = ref(null);

use([BarChart, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { name: '小明', value: 1012 },
      { name: '小红', value: 2012 },
      { name: '小李', value: 3041 },
      { name: '小张', value: 4024 },
      { name: '小王', value: 5051 },
      { name: '小赵', value: 1260 },
      { name: '小孙', value: 7977 },
    ],
  },
  title: {
    type: String,
    default: '排行榜',
  },
  height: {
    type: Number,
    default: 60,
  },
});

// 排序并分成两半
const sortedData = [...props.data].sort((a, b) => Number(a.value) - Number(b.value));
const half = Math.floor(sortedData.length / 2);
const smallHalf = sortedData.slice(0, half);
const bigHalf = sortedData.slice(half);

// 当前显示的数据，初始为小的一半
const currentData = ref([...smallHalf]);

// 颜色列表
const colorList = ['#6874E8', '#EE964B', '#F4D35E'];

// 计算 option
const option = ref({
  title: {
    text: props.title,
    left: 'center',
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: currentData.value.map((item) => item.name),
  },
  series: [
    {
      type: 'bar',
      data: currentData.value.map((item, idx) => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: colorList[idx % colorList.length] },
      })),
    },
  ],
});

// 动态添加剩余数据
onMounted(() => {
  let idx = 0;
  const updateOption = () => {
    option.value.yAxis.data = currentData.value.map((item) => item.name);
    option.value.series = [
      {
        type: 'bar',
        data: currentData.value.map((item, idx) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: colorList[idx % colorList.length] },
        })),
      },
    ];
  };
  updateOption();
  const interval = setInterval(() => {
    if (idx >= bigHalf.length) {
      clearInterval(interval);
      return;
    }
    currentData.value.push(bigHalf[idx]);
    updateOption();
    idx++;
  }, 800);
});
</script>

<style scoped></style>
