<template>
  <div class="w-200 h-full">
    <ListTable :options="options" />
  </div>
</template>
<script setup>
import { ListTable } from '@visactor/vue-vtable';
import { ref, onMounted } from 'vue';
import { addTodo, getTodoList, getTodayTodos, updateTodoStatus, updateTodoContent, deleteTodo } from '@/api/todo';

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
      width: 120,
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
  records: [
    {
      title: '任务1',
      content: '内容1',
      progress: 50,
      status: '未完成',
      create_time: '2023-01-01',
      update_time: '2023-01-01',
    },
  ],
});
</script>
<style scoped></style>
