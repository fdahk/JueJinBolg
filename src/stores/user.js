import { defineStore } from "pinia";
import router from '@/router';
// 已经全局配置了jwt-decode，所以这里不需要再导入
import { jwtDecode } from "jwt-decode";
// import jwt from 'jsonwebtoken' //这是node后端专用的库，浏览器环境运行不了

export const useUserStore = defineStore('user', {
  // 配置项的写法是固定的，不要修改
  state: () => ({
    userName: '', // 用户名
    userPic: '', // 头像
    isLogin: false, // 是否登录
    token : '', // 登录token
    startWorkDate: '',  // 开始工作时间，必填字段
    profession: '',     // 职业方向，必填字段
    position: '',      // 职位，可选字段
    company: '',       // 公司，可选字段
    website: '',      // 个人主页，可选字段
    introduction: '',   // 个人介绍，可选字段
    userPhone: '',      // 用户手机号，用于标识用户
    isNewUser: false    // 是否是新用户
  }),
  // 持久化存储，默认存储在localStorage中，也可以存储在sessionStorage中，也可以自定义存储位置
  persist: {
    storage: localStorage, // 存储在localStorage中
    paths: ['userName', 'userPic', 'isLogin', 'token', 'startWorkDate', 
          'profession', 'position', 'company', 'website', 'introduction', 'userPhone', 'isNewUser'] // 存储哪些字段，默认存储所有字段
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
      // this.userPic = newUserInfo.userPic; // 注意：头像更新在updateUserPic中，这里没有提供数据
      this.password = newUserInfo.password; // 更新密码
      this.startWorkDate = newUserInfo.startWorkDate; // 更新开始工作时间
      this.profession = newUserInfo.profession; // 更新职业方向
      this.position = newUserInfo.position; // 更新职位
      this.company = newUserInfo.company; // 更新公司
      this.website = newUserInfo.website; // 更新个人主页
      this.introduction = newUserInfo.introduction; // 更新个人介绍
      // this.userPhone = newUserInfo.userPhone; // 更新用户手机号
    },
    logOut() { // 退出登录，清除用户信息，token等
      this.userName = ''; // 清除用户名
      this.userPic = ''; // 清除头像
      this.isLogin = false; // 清除登录状态
      this.token = ''; // 清除token
      this.startWorkDate = ''; // 清除开始工作时间
      this.profession = ''; // 清除职业方向
      this.position = ''; // 清除职位
      this.company = ''; // 清除公司
      this.website = ''; // 清除个人主页
      this.introduction = ''; // 清除个人介绍
      this.userPhone = ''; // 清除用户手机号
      this.isNewUser = false; // 清除是否是新用户
      // 跳转到首页
      router.push('/');
    }
  }
})