import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '', // 用户名
    userPic: '', // 头像
    isLogin: false, // 是否登录
    token : ''
  }),
  // 持久化存储，默认存储在localStorage中，也可以存储在sessionStorage中，也可以自定义存储位置
  persist: {
    storage: localStorage, // 存储在localStorage中
    paths: ['userName', 'userPic', 'isLogin', 'token'] // 存储哪些字段，默认存储所有字段
  },
  actions: {
    isTokenExpired() {
      if (!this.token) {
        return false;
      }
      try {
        const decoded = jwtDecode(this.token);
        if (decoded.exp < Date.now() / 1000) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('解析 token 出错:', error);
        return false;
      }
    },
    updateUserInfo(newUserInfo) {
      this.userName = newUserInfo.userName; // 更新用户名
      this.userPic = newUserInfo.userPic; // 更新头像
      this.password = newUserInfo.password; // 更新密码
    },
    logOut() { // 退出登录，清除用户信息，token等
      this.userName = ''; // 清除用户名
      this.userPic = ''; // 清除头像
      this.isLogin = false; // 清除登录状态
      this.token = ''; // 清除token
    }
  }
})