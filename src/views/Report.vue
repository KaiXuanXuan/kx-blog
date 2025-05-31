<template>
  <div>
    报告助手
    <TodoTable/>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { addTodo, getTodoList, getTodayTodos,  updateTodoStatus, updateTodoContent, deleteTodo } from '@/api/todo'
import TodoTable from '@/components/myComponents/TodoTable.vue'

</script>
<style scoped>
  
</style>