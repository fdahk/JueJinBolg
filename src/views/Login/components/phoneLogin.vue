<script setup>
  import { defineEmits } from 'vue';
  const emit = defineEmits(['change']);
  const change = () => {
    emit('change');
  }
</script>

<template>
  <div class="loginBoxBodyLeft">
    <h3 style="color: rgba(0, 0, 0, .8); font-weight: 500; padding-bottom: 10px;">验证码登陆/注册</h3>
    <div class="inputPhoneBox">
      <div class="inputPhoneLeft">
        +86
      </div>
      <div class="inputPhoneRight">
        <input type="text" placeholder="请输入手机号" class="inputPhone">
      </div>
    </div>
    <div class="inputChaptchaBox"> 
      <div class="inputChaptchaLeft">
        <input type="text" placeholder="请输入验证码" class="inputChaptcha">
      </div>
      <button class="getChaptcha">获取验证码</button>
    </div>
    <div class="loginConfirmBox">
      <button class="confirmLogin">登录/注册</button>
    </div>
    <div class="otherLoginBox">
        <p style="color: rgba(0, 0, 0, .8); ">其他登陆:</p>
        <div class="otherLoginList">
          <v-for ></v-for>
        </div>
        <div class="changeLoginMethod" @click="change">密码登录</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .loginBoxBodyLeft {
    width: 330px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    
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
      .inputPhoneLeft {
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
      .inputPhoneRight {
        display: flex;
        align-items: center;
        padding-left: 10px;
        flex: 1;
        height: 100%;
        input {
          padding: 10px;
          border-radius: 5px;
          width: 100%;
          height: 100%;
          background-color: rgba(93, 87, 87, 0);
        }
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