import request from '@/utils/request';

const getBlogList = (params) => {
  return request({
    url: '/blog/list',
    method: 'get',
    params,
  });
};

const getBlogDetail = (params) => {
  return request({
    url: '/blog/detail',
    method: 'get',
    params,
  });
};

const addBlog = (data, blob) => {
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('data', JSON.stringify(data));

  return request({
    url: '/blog/add',
    method: 'post',
    data: formData,
  });
};

const updateBlog = (data, blob) => {
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('data', JSON.stringify(data));

  return request({
    url: '/blog/update',
    method: 'post',
    data: formData,
  });
};

const deleteBlog = (data) => {
  return request({
    url: '/blog/delete',
    method: 'post',
    data,
  });
};

export { getBlogList, getBlogDetail, addBlog, updateBlog, deleteBlog };
