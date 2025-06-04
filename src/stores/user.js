import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '', // 用户名
    avatar: '', // 头像
    isLogin: false, // 是否登录
    token : ''
  }),
})