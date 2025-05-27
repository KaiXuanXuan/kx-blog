import { defineStore } from 'pinia';

export const useLoginStore = defineStore('alert', {
  state: () => ({
    isLogin: false, // 初始登录状态为 false
    userInfo: {}, // 存储用户信息的对象
  }),
  actions: {
    setLogin(value) {
      this.isLogin = value; // 更新登录状态为传入的值
    },
    getLogin() {
      return this.isLogin;
    },
    clearLogin() {
      this.isLogin = false;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo; // 更新用户信息为传入的值
    },
    getUserInfo() {
      return this.userInfo;
    },
    clearUserInfo() {
      this.userInfo = {}; // 清空用户信息
    }
  },
});
