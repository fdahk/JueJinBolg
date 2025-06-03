// 创建全局登录页状态
import { defineStore } from "pinia";
// define的第一个参数是store的id，必须是唯一的，同时也是它在devtools中的显示名称
// 第二个参数是一个配置对象，包含了state、getters、actions等
export const useLoginStore = defineStore('showLogin', {
  state: () => ({
    showLogin : false,
  }),
   actions : {
    // this指的是store实例
      openLogin()  {
        this.showLogin = true;
      },
      closeLogin()  {
        this.showLogin = false;
      }
    }
})   
