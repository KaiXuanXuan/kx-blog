<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-xl font-medium">🔊:今天也要加油鸭💪</div>
      <div class="flex gap-4">
        <Button @click="listOpen = true" variant="outline">所有待办</Button>
        <Button @click="editOpen = true">编辑待办</Button>
        <Button @click="isOpen = true">新增待办</Button>
      </div>
    </div>
    <!-- 待办列表 -->
    <div>
      <transition-group class="grid grid-cols-1 gap-4" name="card" tag="div">
        <Collapsible
          v-model:open="todo.collapsibleOpen"
          v-for="todo in todos"
          :key="todo.id"
          class="rounded-sm overflow-hidden relative shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-yellow-50 z-0"
        >
          <CollapsibleTrigger class="w-full cursor-pointer">
            <div class="flex items-center justify-between w-full py-6 px-10 z-10 relative">
              <p class="text-gray-900 text-xl font-medium">{{ todo.title }}</p>
              <Button v-if="!todo.status" @click.stop="changeStatus(todo, 1)" class="bg-green-500 text-white hover:bg-green-400"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                完成</Button
              >
              <Button v-else @click.stop="changeStatus(todo, 0)" class="bg-blue-500 text-white hover:bg-blue-400"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                回滚</Button
              >
              <div class="text-4xl text-gray-900 font-bold absolute left-[50%] top-[50%] -translate-[50%]">{{ todo.progress }}%</div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div class="w-full px-10 rounded-b-md pb-4 z-10 relative text-gray-600 flex items-center justify-between">
              <div class="flex flex-col">
                <div class="mb-1 font-medium">🔖任务详情：</div>
                <div class="">{{ todo.content }}</div>
              </div>
              <Button class="bg-red-500 text-white hover:bg-red-400" @click.stop="openDeleteDialog(todo.id)"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                删除
              </Button>
            </div>
          </CollapsibleContent>
          <div class="absolute bg-gradient h-full top-0 left-0 z-1 transition-[width] duration-500 " :style="`width: ${todo.progress}%`"></div>
        </Collapsible>
      </transition-group>
    </div>
    <!-- 新增待办dialog -->
    <Dialog v-model:open="isOpen" onOpenChange="(val) => isOpen = val">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增待办任务</DialogTitle>
          <DialogDescription>填写任务详细信息</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <Label for="title">标题</Label>
          <Input id="title" v-model="formData.title" class="w-full" />
          <Label for="content">内容</Label>
          <Textarea id="content" v-model="formData.content" class="w-full" />
          <NumberField :min="0" :max="100" :step="10" :default-value="0" v-model="formData.progress">
            <Label for="progress">进度</Label>
            <NumberFieldContent>
              <NumberFieldDecrement class="cursor-pointer" />
              <NumberFieldInput id="progress" />
              <NumberFieldIncrement class="cursor-pointer" />
            </NumberFieldContent>
          </NumberField>
        </div>
        <DialogFooter>
          <Button class="w-full" @click="handleAddTodo">提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 编辑待办dialog -->
    <Dialog v-model:open="editOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑待办任务</DialogTitle>
          <DialogDescription>填写任务详细信息</DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <Label for="title">标题</Label>
          <Select @update:model-value="changeEditTodo">
            <SelectTrigger class="w-full cursor-pointer">
              <SelectValue placeholder="选择一个待办任务" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="todo in todos" :key="todo.id" :value="todo.id" class="cursor-pointer">
                {{ todo.title }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Label for="content">内容</Label>
          <Textarea v-model="editData.content" class="w-full" />
          <NumberField :min="0" :max="100" :step="10" :default-value="0" v-model="editData.progress">
            <Label for="progress">进度</Label>
            <NumberFieldContent>
              <NumberFieldDecrement class="cursor-pointer" />
              <NumberFieldInput id="progress" />
              <NumberFieldIncrement class="cursor-pointer" />
            </NumberFieldContent>
          </NumberField>
        </div>
        <DialogFooter>
          <Button class="w-full" @click="handleEditTodo">提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 确认删除Dialog -->
    <Dialog v-model:open="deleteOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>确定要删除该任务吗？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button @click="deleteOpen = false" variant="outline">取消</Button>
          <Button @click="handleDeleteTodo">确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 所有待办 -->
    <Dialog v-model:open="listOpen">
      <DialogContent class="h-[90%]">
        <TodoTable :records="todos" />
      </DialogContent>
    </Dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { addTodo, getTodayTodos, updateTodoStatus, updateTodoContent, deleteTodo } from '@/api/todo';
import TodoTable from '@/components/myComponents/TodoTable.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberField, NumberFieldInput, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement } from '@/components/ui/number-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const isOpen = ref(false);
const editOpen = ref(false);
const listOpen = ref(false);
const deleteOpen = ref(false);
const formData = ref({ id: '', title: '', content: '', progress: 0 });
const editData = ref({ id: '', title: '', content: '', progress: 0 });
const deleteId = ref('');
const todos = ref([]);

// 初始化加载待办列表
const loadTodos = async () => {
  const res = await getTodayTodos();
  todos.value = res.data;
};
loadTodos();

const changeStatus = (todo, checked) => {
  const { id } = todo;
  updateTodoStatus({ id, status: checked }).then(() => {
    loadTodos();
  });
};

const openDeleteDialog = (id) => {
  deleteOpen.value = true; // 打开确认删除对话框
  deleteId.value = id; // 设置要删除的任务ID
};
const handleDeleteTodo = () => {
  const id = deleteId.value;
  deleteTodo(id)
    .then(() => {
      loadTodos();
    })
    .finally(() => {
      deleteOpen.value = false;
    });
};

const changeEditTodo = (val) => {
  const todo = todos.value.find((todo) => todo.id === val);
  const { id, title, content, progress } = todo;
  editData.value = { id, title, content, progress };
};

const handleEditTodo = () => {
  updateTodoContent(editData.value)
    .then(() => {
      loadTodos();
      editData.value = { id: '', title: '', content: '', progress: 0 };
    })
    .then(() => {
      editOpen.value = false;
    });
};

const handleAddTodo = () => {
  addTodo(formData.value)
    .then(() => {
      loadTodos(); // 提交成功后重新加载待办列表
      formData.value = { id: '', title: '', content: '', progress: 0 }; // 重置表单
    })
    .finally(() => {
      isOpen.value = false; // 关闭对话框
    });
};
</script>
<style scoped>
.bg-gradient {
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}
</style>
