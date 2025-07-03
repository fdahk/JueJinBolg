<script setup>
  import {ref} from 'vue'
  import { handlePasswordLoginReq } from '@/apis/login';
  import { useUserStore } from '@/stores/user';
  import { useLoginStore } from '@/stores/login';
  import { showToast } from '@/utils/toast';
  const userStore = useUserStore()
  const loginStore = useLoginStore()
  import { defineEmits } from 'vue';
  const emit = defineEmits(['change']);
  const change = () => {
    emit('change');
  }
  const otherLoginList = [
    {
      name: '微信',
      icon: 'icon-wechat-fill',
      color: 'green'
    },
    {
      name: 'QQ',
      icon: 'icon-QQ',
      color: 'rgba(58, 114, 170, 1)'
    },
    {
      name: '支付宝',
      icon: 'icon-alipay',
      color: 'rgba(58, 114, 170, 1)'
    },
    {
      name: 'GitHub',
      icon: 'icon-github-fill',
      color: 'black'
    }
  ]
  // 登录
  const password = ref('') 
  const userPhone = ref('')
  const HandlePasswordLogin = async () => {
    // 以下写法会导致index.js:33  Uncaught (in promise) TypeError: Converting circular structure to JSON 报错
    // const res = await handlePasswordLoginReq({userPhone, password})
    const res = await handlePasswordLoginReq({userPhone:userPhone.value, password: password.value})
    console.log(res);// 调试
    // 后端send、statue发送的信息通过res.data.获取
    if(res.data.code === 200) {
      showToast(res.data.message)
      userStore.isLogin = true 
      userStore.token = res.data.token
      // 这里可以优化下，将store的用户信息写成数组或对象形式，直接解构赋值方便点
      // 或者用Object.assign()方法，将res.data.userInfo的属性赋值给userStore，注意键名要一致
      Object.assign(userStore, res.data.userInfo)
      loginStore.showLogin = false
    } else if(res.data.code === 400) {
      showToast(res.data.message)
    }else {
      showToast(res.data.message)
    }

  }
 
</script>

<template>
  <div class="loginBoxBodyLeft">
    <h3 style="color: rgba(0, 0, 0, .8); font-weight: 500; padding-bottom: 10px;">密码登录</h3>
    <div class="inputPhoneBox">
      <input type="text" placeholder="请输入手机号" class="inputPhone" v-model="userPhone">
    </div>
    <div class="inputChaptchaBox"> 
      <div class="inputChaptchaLeft">
        <input type="text" placeholder="请输入密码" class="inputChaptcha" v-model="password">
      </div>
      <button class="getChaptcha">忘记密码</button>
    </div>
    <div class="loginConfirmBox">
      <button class="confirmLogin" @click="HandlePasswordLogin">登录</button>
    </div>
    <div class="otherLoginBox">
        <p style="color: rgba(0, 0, 0, .8); ">其他登陆:</p>
        <ul class="otherLoginList">
          <li v-for="item in otherLoginList" :key="item.name">
              <i class="iconfont" :class="item.icon" :style="{color: item.color}"></i>
          </li>
        </ul>
        <div class="changeLoginMethod" @click="change">验证码登录</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .loginBoxBodyLeft {
    width: 330px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    position: relative;
    // 手机号输入框
    .inputPhoneBox {
      height: 2.5rem;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: rgba(93, 87, 87, 0.1);
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 20px;
        input {
          padding: 10px;
          border-radius: 5px;
          width: 100%;
          height: 100%;
          background-color: rgba(93, 87, 87, 0);
        }
    }
    // 验证码输入框
    .inputChaptchaBox {
      width: 100%;
      height: 2.5rem;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      align-items: center;
      background-color: rgba(93, 87, 87, 0.1);
      margin-bottom: 20px;
      .inputChaptchaLeft {
        height: 100%;
          flex: 1;
        input {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          height: 100%;
          background-color: rgba(93, 87, 87, 0); 
        }
      }
      .getChaptcha {
        height: 100%;
        padding-right: 10px;
        color: $primaryColor;
      }
    }
    .loginConfirmBox {
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
        background-color: $primaryColor;
        display: flex;
        align-items: center;
        .confirmLogin {
          width: 100%;
          height: 100%;
          background-color: $primaryColor;
          color: white;
        }
    }
    .otherLoginBox {
        flex: 1;
        display: flex;
        position: relative;
        align-items: center;
        font-size: .9rem;
       .otherLoginList {
        height: 100%;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        li {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iconfont {
          font-size: 1.2rem;
        }
       }
       .changeLoginMethod {
          color: $primaryColor;
          position: absolute;
          right: 0;
          cursor: pointer;
       }
    }
  }
</style>