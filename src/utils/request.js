import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'vue-sonner';
import { useLoginStore } from '@/stores/login';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://117.72.35.18/api' : '/api',
  timeout: 10000,
  withCredentials: true,
});

const toastErrorMessage = (message) => {
  toast.error('错误', {
    description: message,
  });
};

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const csrfToken = Cookie.get('csrfToken') || sessionStorage.getItem('csrfToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // toast.success(res.message);
    return res;
  },
  (error) => {
    const response = error.request.response;
    const message = response ? JSON.parse(response).message : '请求错误';
    toastErrorMessage(message);

    // 如果是 401 错误，清除登录信息
    if (error.response && error.response.status === 401) {
      const loginStore = useLoginStore();
      loginStore.clearLogin();
      loginStore.clearUserInfo();

      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('id');

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('id');

      const { csrfToken } = error.response.data;
      sessionStorage.setItem('csrfToken', csrfToken);
    }
    return Promise.reject(error);
  }
);

export default service;
