import request from '@/utils/request';

const connect = () => {
  return request({
    url: '/',
    method: 'get',
  });
};

export { connect };
