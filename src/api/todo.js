import request from '@/utils/request';

// 新增待办
export const addTodo = async (data) => {
  return request.post('/todo/add', data);
};

// 更新内容（标题和内容）
export const updateTodoContent = async (data) => {
  return request.put('/todo/content', data);
};

// 更新状态
export const updateTodoStatus = async (data) => {
  return request.put('/todo/status', data);
};

// 分页查询所有待办
export const getTodoList = async (page = 1, pageSize = 10) => {
  return request.get('/todos', { params: { page, pageSize } });
};

// 查询今日待办
export const getTodayTodos = async () => {
  return request.get('/todos/today');
};

// 删除待办
export const deleteTodo = async (id) => {
  return request.delete('/todo/delete', { params: { id } });
};

// 发送给报告助手
export const sendMessageToAgent = async (text) => {
  return request.post('/todo/agent', { text });
};
