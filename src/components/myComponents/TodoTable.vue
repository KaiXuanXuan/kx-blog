<template>
  <div class="w-full max-w-[100rem] h-[50rem] overflow-auto">
    <ListTable :options="options" />
  </div>
</template>
<script setup>
import { ListTable } from '@visactor/vue-vtable';
import { ref, watch, defineProps } from 'vue';
import { formateDate } from '@/utils/helper';
import { addTodo, getTodoList, getTodayTodos, updateTodoStatus, updateTodoContent, deleteTodo } from '@/api/todo';

const props = defineProps({
  records: {
    type: Array,
    default: () => [],
  },
});

const options = ref({
  header: [
    {
      field: 'title',
      caption: '标题',
      width: 'auto',
    },
    {
      field: 'content',
      caption: '内容',
      width: 'auto',
    },
    {
      field: 'progress',
      caption: '进度',
      cellType: 'progressbar',
      min: 0,
      max: 100,
      width: 150,
      barType: 'default',
      style: {
        showBar: true,
        barColor: (data) => {
          return `rgb(${200 + 50 * (1 - data.percentile)},${255 * (1 - data.percentile)},${255 * (1 - data.percentile)})`;
        },
        barHeight: 20,
        barBottom: '30%',
      },
    },
    {
      field: 'status',
      caption: '状态',
      width: 'auto',
    },
    {
      field: 'create_time',
      caption: '创建时间',
      width: 'auto',
    },
    {
      field: 'update_time',
      caption: '更新时间',
      width: 'auto',
    },
  ],
  records: props.records,
});

// 监听 records 变化，动态更新 options
watch(
  () => props.records,
  (val) => {
    let newRecords = [];
    for (let i = 0; i < val.length; i++) {
      newRecords.push({
        ...val[i],
        create_time: formateDate(val[i].create_time),
        update_time: formateDate(val[i].update_time),
      });
    }
    options.value.records = newRecords;
  },
  { immediate: true }
);
</script>
<style scoped></style>
