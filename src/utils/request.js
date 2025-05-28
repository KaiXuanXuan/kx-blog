import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'vue-sonner';
import { useLoginStore } from '@/stores/login';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://117.72.35.18:7001/api' : '/api',
  timeout: 10000,
});

const toastErrorMessage = (message) => {
  toast.error('错误', {
    description: message,
  });
};

const toastWarningMessage = (message) => {
  toast.warning('警告', {
    description: message,
  });
};

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const csrfToken = Cookie.get('csrfToken');
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
    if (res.code !== 200) {
      toastWarningMessage(res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    }
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
    }
    return Promise.reject(error);
  }
);

export default service;
