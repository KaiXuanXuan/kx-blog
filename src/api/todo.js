import request from '@/utils/request';

// 新增待办
export const addTodo = async (title, content) => {
  return request.post('/api/todo/add', { title, content });
};

// 更新内容（标题和内容）
export const updateTodoContent = async (id, title, content) => {
  return request.put('/api/todo/content', { id, title, content });
};

// 更新状态
export const updateTodoStatus = async (id, status) => {
  return request.put('/api/todo/status', { id, status });
};

// 分页查询所有待办
export const getTodoList = async (page = 1, pageSize = 10) => {
  return request.get('/api/todos', { params: { page, pageSize } });
};

// 查询今日待办
export const getTodayTodos = async () => {
  return request.get('/api/todos/today');
};

// 删除待办
export const deleteTodo = async (id) => {
  return request.delete(`/api/todo/${id}`);
};
