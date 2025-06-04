// 创建全局登录页状态
import { defineStore } from "pinia";
// define的第一个参数是store的id，必须是唯一的，同时也是它在devtools中的显示名称
// 第二个参数是一个配置对象，包含了state、getters、actions等
//定义一个 store。通过这个函数，我们可以创建一个具有状态（state）、获取器（getters）和动作（actions）的状态管理模块
// 在组件中需要先引入pinia，然后再引入store，然后再创建store实例，才能调用
export const useLoginStore = defineStore('showLogin', {
  // 注意函数体要用括号包裹，避免将花括号对象解析成一个代码块
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
