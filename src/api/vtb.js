import request from '@/utils/request';

export const getVtbsFullInfo = () =>{
  return request({
    url: '/vtb/info',
    method: 'get',
  })
}