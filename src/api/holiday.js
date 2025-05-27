import axios from 'axios';

const request = axios.create({
  baseURL: 'https://timor.tech/api/holiday',
  timeout: 15000
});

// 请求拦截器
request.interceptors.request.use(config => {
  // 添加自定义请求头（按需）
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('外部接口请求错误:', error);
    return Promise.reject(error);
  }
);

export const getNextHoliday = (params) => {
  return request({
    method: 'get',
    url: `/next/${params}`,
  });
};