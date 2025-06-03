import request from '@/utils/request';

export const getHotSearch = () => {
  return request({
    url: '/hotSearch/latest',
    method: 'get',
  });
};
