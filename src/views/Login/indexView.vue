<script setup> 
  import {ref, defineExpose} from 'vue'
  import phoneLogin from './components/captchaLogin.vue'
  import accountLogin from './components/passwordLogin.vue'
  import {useLoginStore} from '@/stores/login'

  // 切换登录方式
  const changeLoginMethod = ref(false)
  const handleChangeLoginMethod = () => {
    changeLoginMethod.value = !changeLoginMethod.value
  }
  //关闭登陆页面 
  const showLogin = ref(false)
  const handleCloseLogin = () => {
    useLoginStore().closeLogin()
  }
  defineExpose({
    showLogin
  })
</script>

<template>
  <div class="loginContainer" v-show="useLoginStore().showLogin">
    <div class="loginBox">
      <div class="loginBoxHead">
        <h2 style="font-weight: 400;">登录掘金畅享更多权益</h2>
        <el-icon style="height: 25px; width: 25px; cursor: pointer;" @click="handleCloseLogin">
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
          <a href="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/juejin/86857833-55f6-4d9e-9897-45cfe9a42be4.html" target="_blank">
            用户协议
          </a>
          和 
          <a href="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/juejin/7b28b328-1ae4-4781-8d46-430fef1b872e.html" target="_blank">
            隐私政策
          </a>
        </div>
        <div class="agreeBox2">
          <input type="checkbox" checked>
          注册时允许授权注册Trae
          <a href="https://www.trae.com.cn/terms-of-service?utm_source=juejin&utm_medium=juejin_trae&utm_campaign=juejin_content" target="_blank">
            用户协议
          </a>
          和 
          <a href="https://www.trae.com.cn/privacy-policy?utm_source=juejin&utm_medium=juejin_trae&utm_campaign=juejin_content" target="_blank">
            隐私政策
          </a>
        </div>        
      </div>
    </div>  
  </div>
</template>

<style scoped lang="scss">
  .loginContainer {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5000;
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
      margin-top: 20px;
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