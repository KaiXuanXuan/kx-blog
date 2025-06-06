import request from '@/utils/request';
// 资源分类接口
const addResourceCategory = (title) => {
  return request({
    url: '/resource/category/add',
    method: 'post',
    data: { title },
  });
};

const getResourceCategories = () => {
  return request({
    url: '/resource/categories',
    method: 'get',
  });
};

const updateResourceCategory = (id, title) => {
  return request({
    url: '/resource/category/update',
    method: 'put',
    data: { id, title },
  });
};

const deleteResourceCategory = (id) => {
  return request({
    url: '/resource/category/delete',
    method: 'delete',
    data: { id },
  });
};

// 资源条目接口
const addResourceItem = (data, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(data));

  return request({
    url: '/resource/item/add',
    method: 'post',
    data: formData,
  });
};

const getItemsByCategory = (category_id) => {
  return request({
    url: '/resource/items',
    method: 'get',
    params: { category_id },
  });
};

const updateResourceItem = (data, file) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  // 如果file的值不为undefined，则添加到formData中
  console.log(file);

  if (file.name !== 'undefined') {
    formData.append('file', file);
  }

  return request({
    url: '/resource/item/update',
    method: 'put',
    data: formData,
  });
};

const deleteResourceItem = (id) => {
  return request({
    url: '/resource/item/delete',
    method: 'delete',
    data: { id },
  });
};

// 资源搜索接口
const searchResources = (keyword) => {
  return request({
    url: '/resource/search',
    method: 'get',
    params: { keyword },
  });
};

export { addResourceCategory, getResourceCategories, updateResourceCategory, deleteResourceCategory, addResourceItem, updateResourceItem, getItemsByCategory, deleteResourceItem, searchResources };
