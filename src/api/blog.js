import request from '@/utils/request';

const getBlogList = () => {
  return request({
    url: '/blog/list',
    method: 'get',
  });
};

const getBlogPage = (page, pageSize) => {
  return request({
    url: '/blog/page',
    method: 'get',
    params: {
      page,
      pageSize,
    },
  });
};

const getBlogDetail = (id) => {
  return request({
    url: '/blog/detail',
    method: 'get',
    params: {
      id,
    },
  });
};

const addBlog = (data, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(data));

  return request({
    url: '/blog/add',
    method: 'post',
    data: formData,
  });
};

const updateBlog = (data, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(data));

  return request({
    url: '/blog/update',
    method: 'post',
    data: formData,
  });
};

const deleteBlog = (id) => {
  return request({
    url: '/blog/delete',
    method: 'delete',
    data: {
      id,
    },
  });
};

export { getBlogList, getBlogPage, getBlogDetail, addBlog, updateBlog, deleteBlog };
