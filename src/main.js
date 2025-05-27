import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import request from '@/utils/request';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');

// 挂载到vue实例
app.config.globalProperties.$http = request;
