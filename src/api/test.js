import request from '@/utils/request';

const testEgg = () => {
  return request({
    url: '/test',
    method: 'get',
  });
};

export { testEgg };
