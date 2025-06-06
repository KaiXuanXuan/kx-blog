<template>
  <Tabs default-value="todo">
    <TabsList class="mx-auto mt-2 w-60">
      <TabsTrigger value="todo" class="cursor-pointer"> 每日待办 </TabsTrigger>
      <TabsTrigger value="agent" class="cursor-pointer"> 报告助手 </TabsTrigger>
    </TabsList>
    <TabsContent value="todo">
      <div class="max-w-7xl mx-auto px-4 py-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-xl font-medium">🔊:今天也要加油鸭💪</div>
          <div class="flex gap-4">
            <Button @click="listOpen = true" variant="outline">所有待办</Button>
            <Button @click="openEditDialog">编辑待办</Button>
            <Button @click="isOpen = true">新增待办</Button>
          </div>
        </div>
        <!-- 待办列表 -->
        <div>
          <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Collapsible
              v-for="todo in todos"
              v-model:open="todo.collapsibleOpen"
              :key="todo.id"
              class="relative bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 mb-4 dark:bg-gray-800 dark:border-gray-700"
            >
              <CollapsibleTrigger class="w-full cursor-pointer hover:bg-gray-100 transition-colors duration-300 rounded-t-xl dark:hover:bg-gray-700">
                <div class="flex items-center justify-between px-6 py-5">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ todo.title }}</span>
                    <span
                      class="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': todo.progress <= 20,
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': todo.progress > 20 && todo.progress <= 70,
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': todo.progress > 70 && todo.progress < 100,
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': todo.progress >= 100,
                      }"
                    >
                      {{ todo.progress }}%
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <Button
                      v-if="!todo.status"
                      @click.stop="changeStatus(todo, 1)"
                      class="bg-green-500 hover:bg-green-400 text-white rounded-full w-9 h-9 flex items-center justify-center dark:bg-green-600 dark:hover:bg-green-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </Button>
                    <Button
                      v-else
                      @click.stop="changeStatus(todo, 0)"
                      class="bg-blue-500 hover:bg-blue-400 text-white rounded-full w-9 h-9 flex items-center justify-center dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </Button>
                    <Button
                      @click.stop="openDeleteDialog(todo.id)"
                      class="bg-red-100 hover:bg-red-200 text-red-700 rounded-full w-9 h-9 flex items-center justify-center dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div class="px-6 pb-5 pt-2 text-gray-700 dark:text-gray-200">
                  <div class="mb-2 flex items-center gap-2">
                    <span class="font-medium">任务详情</span>
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800': todo.progress <= 20,
                        'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800': todo.progress > 20 && todo.progress <= 70,
                        'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800': todo.progress > 70 && todo.progress < 100,
                        'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800': todo.progress >= 100,
                      }"
                    >
                      <template v-if="todo.progress <= 20">⚡起步中</template>
                      <template v-else-if="todo.progress <= 70">🔥进行中</template>
                      <template v-else-if="todo.progress < 100">🩵收尾中</template>
                      <template v-else>✅已完成</template>
                    </span>
                  </div>
                  <div class="text-gray-600 dark:text-gray-300">{{ todo.content }}</div>
                  <!-- 进度条 -->
                  <div class="w-full h-2 bg-gray-100 rounded-full mt-4 dark:bg-gray-700">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      :class="{
                        'bg-yellow-400 dark:bg-yellow-500': todo.progress <= 20,
                        'bg-red-400 dark:bg-red-500': todo.progress > 20 && todo.progress <= 70,
                        'bg-blue-400 dark:bg-blue-500': todo.progress > 70 && todo.progress < 100,
                        'bg-green-400 dark:bg-green-500': todo.progress >= 100,
                      }"
                      :style="`width: ${todo.progress}%`"
                    ></div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <!-- 占位提示 -->
          <div v-if="todos.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
            <svg class="w-16 h-16 mb-4 text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
            <div class="text-lg font-semibold">暂无待办任务</div>
            <div class="text-sm mt-1">点击右上角"新增待办"按钮添加任务吧！</div>
          </div>
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
              <NumberField :min="0" :max="100" :step="5" :default-value="0" v-model="formData.progress">
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
              <Select v-model="editData.id" @update:model-value="changeEditTodo">
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
    </TabsContent>
    <TabsContent value="agent">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- 打字机文本显示容器 -->
        <div v-if="chatList.length > 0" class="pb-36 bottom-[calc(100% + 20px)] left-0 right-0 mx-auto max-w-7xl px-4">
          <div class="flex flex-col gap-3">
            <div
              v-for="(msg, idx) in chatList"
              :key="idx"
              :class="[
                'max-w-[70%] px-4 py-3 rounded-xl text-base break-words',
                msg.role === 'user' ? 'self-end bg-green-100 text-green-900 text-right' : 'self-start bg-blue-50 text-blue-900 shadow',
              ]"
            >
              <template v-if="msg.role === 'ai'">
                <template v-if="!msg.content">
                  <!-- 加载动画 -->
                  <div class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span class="text-gray-400">AI正在思考...</span>
                  </div>
                </template>
                <v-md-preview v-else :text="msg.content" class="whitespace-pre-line" />
              </template>
              <div v-else class="whitespace-pre-line">{{ msg.content }}</div>
            </div>
          </div>
        </div>
        <div v-else class="pt-36 pb-36 flex flex-col items-center justify-center text-gray-400 h-80 select-none">
          <div class="mb-2 text-4xl">🙂</div>
          <div class="text-lg font-semibold mb-2">请输入报告提示词</div>
          <div class="text-base">
            如：
            <span class="text-blue-400 cursor-pointer hover:underline select-auto" @click="handleKeywordClick('本周周报')">本周周报</span>
            、
            <span class="text-blue-400 cursor-pointer hover:underline select-auto" @click="handleKeywordClick('昨日日报')">本日日报</span>
            ，即可自动总结与输出
          </div>
        </div>
        <!-- textarea输入容器 -->
        <div class="fixed bottom-5 left-0 right-0 mx-auto max-w-7xl px-4 z-20">
          <div class="relative bg-gray-100 rounded-2xl shadow-md p-4 flex items-end">
            <textarea
              ref="textareaRef"
              v-model="text"
              class="w-full h-24 resize-none bg-transparent outline-none border-none text-base"
              placeholder="请输入内容"
              @keydown.enter.prevent="handleSendMessage"
            />
            <!-- 发送按钮 -->
            <button
              class="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              :class="text.trim() ? 'bg-blue-500 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'"
              :disabled="!text.trim()"
              @click="handleSendMessage"
              type="button"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
<script setup>
import { ref, nextTick } from 'vue';
import { addTodo, getTodayTodos, updateTodoStatus, updateTodoContent, deleteTodo, sendMessageToAgent } from '@/api/todo';
import TodoTable from '@/components/myComponents/TodoTable.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberField, NumberFieldInput, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement } from '@/components/ui/number-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Cookie from 'js-cookie';

const isOpen = ref(false);
const editOpen = ref(false);
const listOpen = ref(false);
const deleteOpen = ref(false);
const formData = ref({ id: '', title: '', content: '', progress: 0 });
const editData = ref({ id: '', title: '', content: '', progress: 0 });
const deleteId = ref('');
const todos = ref([]);
const text = ref('');
const textareaRef = ref(null);
const isTyping = ref(false); // 标记是否在打字中
const chatList = ref([]);

// 初始化加载待办列表
const loadTodos = async () => {
  // 1. 先保存当前 open 状态
  const openMap = {};
  todos.value.forEach((item) => {
    openMap[item.id] = item.collapsibleOpen;
  });

  // 2. 获取新数据
  const res = await getTodayTodos();

  // 3. 赋值时保留原有 open 状态
  todos.value = (res.data || []).map((item) => ({
    ...item,
    collapsibleOpen: openMap[item.id] ?? true,
  }));
};
loadTodos();

const changeStatus = (todo, checked) => {
  const { id } = todo;
  updateTodoStatus({ id, status: checked }).then(() => {
    loadTodos();
  });
};

const handleSendMessage = async () => {
  if (isTyping.value || !text.value.trim()) return;
  isTyping.value = true;

  chatList.value.push({ role: 'user', content: text.value });
  chatList.value.push({ role: 'ai', content: '' });
  const aiMsgIndex = chatList.value.length - 1;
  text.value = '';

  const baseURL = process.env.NODE_ENV === 'production' ? 'https://117.72.35.18/api' : '/api';
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const csrfToken = Cookie.get('csrfToken');
  const url = `${baseURL}/todo/agent`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ text: chatList.value[aiMsgIndex - 1].content }),
      credentials: 'include',
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // 处理SSE格式的数据块
      let lines = buffer.split('\n\n');
      buffer = lines.pop(); // 可能有半包，留到下次
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '');
          try {
            const obj = JSON.parse(jsonStr);
            const { event, data } = obj;

            if (event === 'conversation.chat.created') {
              console.log('对话开始');
            }

            if (event === 'conversation.message.delta') {
              const content = data.content;
              console.log('传输增量消息', content);
              chatList.value[aiMsgIndex].content += content;
            }

            if (event === 'conversation.message.completed') {
              const content = data.content;
              console.log('消息传输完毕', content);
              if (data.type === 'answer') {
                // 去除开头的```markdown和结尾的```
                let mdContent = content;
                // 去除开头的 ```markdown
                if (mdContent.startsWith('```markdown')) {
                  mdContent = mdContent.slice(11);
                }
                // 去除结尾的 ```
                if (mdContent.endsWith('```')) {
                  mdContent = mdContent.slice(0, -3);
                }
                // 去除首尾多余的换行
                mdContent = mdContent.trim();
                chatList.value[aiMsgIndex].content = mdContent;
              }
            }

            if (event === 'conversation.chat.completed') {
              console.log('对话结束');
            }
          } catch (e) {
            // 解析失败可以忽略或报错
            console.log('解析失败', e);
          }
        }
      }
    }
  } catch (err) {
    console.log('请求失败', err);
  } finally {
    isTyping.value = false;
  }
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
      formData.value = { id: '', title: '', content: '', progress: 0, collapsibleOpen: false }; // 重置表单
    })
    .finally(() => {
      isOpen.value = false; // 关闭对话框
    });
};

const handleKeywordClick = (keyword) => {
  text.value = keyword;
  // 聚焦到输入框
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const openEditDialog = () => {
  if (todos.value.length > 0) {
    editData.value.id = todos.value[0].id;
    changeEditTodo(todos.value[0].id);
  }
  editOpen.value = true;
};
</script>
