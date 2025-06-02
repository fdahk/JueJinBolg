<script setup> 
  import {ref} from 'vue'
  import { handleLogin, handleReg } from '@/apis/login';
  import phoneLogin from './components/phoneLogin.vue'
  import accountLogin from './components/accountLogin.vue'
  // 登录表单数据
  const loginForm = ref({
    userName: '',
    passWord: ''
  })
  // 注册表单数据
  const regForm = ref({
    userName: '',
    passWord: '',
    passWord2: ''
  })
  // 切换登录方式
  const changeLoginMethod = ref(false)
  const handleChangeLoginMethod = () => {
    changeLoginMethod.value = !changeLoginMethod.value
  }
</script>

<template>
  <div class="loginContainer">
    <div class="loginBox">
      <div class="loginBoxHead">
        <h2 style="font-weight: 400;">登录掘金畅享更多权益</h2>
        <el-icon style="height: 25px; width: 25px;">
          <Close />
        </el-icon>
      </div>
      <div class="loginBoxBody">
        <phoneLogin v-show="changeLoginMethod" @change="handleChangeLoginMethod"/>
        <accountLogin v-show="!changeLoginMethod" @change="handleChangeLoginMethod"/>
        <div class="loginBoxBodyRight">
          <div class="loginBoxBodyRightTitle">
            <h3 style="color: rgba(0, 0, 0, .8); font-weight: 500;">扫码登陆</h3>
            <p style="color: rgba(0, 0, 0, .5); font-size: .8rem;">（6.4.1及以上版本支持）</p>
          </div>
          <div class="loginBoxBodyRightPicBox">
            <img src="@\assets\images\QR.jpg" alt="">
          </div>
        </div>
      </div>
      <div class="loginBoxFoot">
        <div class="agreeBox1">
          注册登录即表示同意
          <a href="">用户协议</a>
          和 
          <a href="">隐私政策</a>
        </div>
        <div class="agreeBox2">
          <input type="checkbox" checked>
          注册时允许授权注册Trae
          <a href="">用户协议</a>
          和 
          <a href="">隐私政策</a>
        </div>        
      </div>
    </div>  
  </div>
</template>

<style scoped lang="scss">
  .loginContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
  }

  .loginBox {
    width: 650px;
    height: 440px;
    background-color: white;
    border-radius: 5px;
    flex-direction: row;
  }

  .loginBoxHead {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, .8);
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }

  .loginBoxBody {
      display: flex;
      padding: 10px 20px 20px 20px;
      height: 280px;
    } 


    .loginBoxBodyRight {
      flex: 1;
      height: 100%;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid rgba(0, 0, 0,.1);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .loginBoxBodyRightTitle {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }
     .loginBoxBodyRightPicBox {
       width: 150px;
       height: 150px;
       overflow: hidden;
       position: relative;
       border: 1px solid rgba(0, 0, 0,.5);
       img {
        width: 100%;
        height: 100%;
        object-fit: cover;
       }
     }
    }
    .loginBoxFoot {
      display: flex;
      align-items: center;
      flex-direction: column;
      .agreeBox1 {
        font-size: .9rem;
        color: rgba(0, 0, 0,.5);
        a {
          color: $primaryColor;
        }
      }
      .agreeBox2 {
        font-size: .9rem;
        color: rgba(0, 0, 0,.5);
        a {
          color: $primaryColor;
        }
      }
    }



</style>