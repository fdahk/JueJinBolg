<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { handleGetCaptchaReq, handleUpdatePasswordReq } from '@/apis/login';
import { showSuccess, showError } from '@/utils/toast';
const userStore = useUserStore();
const showSetPhoneBox = ref(false);
const showSetPasswordBox = ref(false);
const captchaInput = ref('');
const passwordInput = ref('');

const getCaptcha = async () => {
  const res = await handleGetCaptchaReq({userPhone: userStore.userPhone})
  if(res.data.code === 200) {
    showSuccess(res.data.message)
  } else {
    showError(res.data.message)
  }
}

const updatePassword = async () => {
  const res = await handleUpdatePasswordReq({userPhone: userStore.userPhone, password: passwordInput.value, captcha: captchaInput.value})
  if(res.data.code === 200) {
    showSuccess(res.data.message)
    showSetPasswordBox.value = false
    captchaInput.value = ''
    passwordInput.value = ''  
  } else {
    showError(res.data.message)
  }
}
</script>

<template>
  <div class="account-container">
    <div class="account-box">
      <div class="account-box-head">
        <h2>账号设置</h2>
      </div>
      <div class="account-box-body">
        <!-- 更换手机号 -->
        <div class="set-phone">
          <div class="set-phone-left">更换手机号</div>
          <button class="set-phone-right" @click="showSetPhoneBox = true">换绑</button>
        </div>
        <!-- 修改密码 -->
        <div class="set-password">
          <div class="set-password-left">修改密码</div>
          <button class="set-password-right" @click="showSetPasswordBox = true">修改</button>
        </div>
      </div>
      
      <!-- 弹窗区域 -->
       <!-- 更换手机号弹窗 -->
       <div class="set-phone-modal" v-if="showSetPhoneBox">
        <div class="modal-mask"></div>
        <div class="modal-content">
          <div class="modal-header">
            <span>手机换绑</span>
            <span class="modal-close" @click="showSetPhoneBox = false">×</span>
          </div>
          <div class="modal-body">
            <div class="old-phone">原手机号{{ userStore.userPhone }}</div>
            <div class="input-group">
              <input class="input" placeholder="验证码" />
              <button class="get-code-btn">获取验证码</button>
            </div>
            <button class="next-btn">下一步</button>
          </div>
        </div>
      </div>
       <!-- 修改密码弹窗 -->
       <div class="set-password-modal" v-if="showSetPasswordBox">
        <div class="modal-mask"></div>
        <div class="modal-content">
          <div class="modal-header">
            <span>手机重置密码</span>
            <span class="modal-close" @click="showSetPasswordBox = false">×</span>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <select class="area-code">
                <option value="+86">+86</option>
                <!-- 其它手机号区号 -->
              </select>
              <input class="input" placeholder="请输入手机号" />
            </div>
            <div class="input-group">
              <input v-model="captchaInput" class="input" placeholder="验证码" />
              <button class="get-code-btn" @click="getCaptcha">获取验证码</button>
            </div>
            <input v-model="passwordInput" class="input" placeholder="请输入新密码" style="margin-bottom: 12px;" />
            <button class="next-btn" @click="updatePassword">修改</button>
            <a class="email-reset" href="#">邮箱重置密码</a>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-container {
  flex: 1;
  height: 100%;
  background-color: white;
  margin-left: 20px;
  .account-box {
    padding: 20px;
  }
} 

.account-box-head {
  h2 {
    font-size: 1.2rem;
  }
}
/* 更换手机号 */
.set-phone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  .set-phone-left {
    font-size: .9rem;
  }
  .set-phone-right {
    background-color: $primaryColor;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
}
/* 修改密码 */
.set-password {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  .set-password-left {
    font-size: .9rem;
  }
  .set-password-right {
    background-color: $primaryColor;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
}

/* 弹窗样式 */
// 弹窗通用样式
.input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 15px;
    }

/* 更换手机号弹窗 */
.set-phone-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-mask {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.15);
    z-index: 1;
  }

  .modal-content {
    position: relative;
    z-index: 2;
    background: #fff;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 32px 32px 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .modal-close {
    font-size: 22px;
    cursor: pointer;
    color: #888;
    transition: color 0.2s;
    &:hover {
      color: #333;
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .old-phone {
    color: #333;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    .get-code-btn {
      padding: 0 12px;
      background: #fff;
      border: 1px solid $primaryColor;
      color: $primaryColor;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      transition: background 0.2s;
      &:hover {
        background: #e6f7ff;
      }
    }
  }

  .next-btn {
    width: 100%;
    padding: 10px 0;
    background: $primaryColor;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 17px;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
    &:hover {
      background: $primaryColor;
    }
  }
}
/* 修改密码弹窗 */
.set-password-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-mask {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.15);
    z-index: 1;
  }

  .modal-content {
    position: relative;
    z-index: 2;
    background: #fff;
    border-radius: 8px;
    width: 420px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 32px 32px 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-top: 40px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 18px;
    margin-top: 40px;
  }

  .modal-close {
    font-size: 22px;
    cursor: pointer;
    color: #888;
    transition: color 0.2s;
    &:hover {
      color: #333;
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 0;
    .area-code {
      width: 80px;
      padding: 8px 4px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 15px;
      background: #fff;
    }
    .get-code-btn {
      padding: 0 12px;
      background: #fff;
      border: 1px solid $primaryColor;
      color: $primaryColor;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      transition: background 0.2s;
      &:hover {
        background: #e6f7ff;
      }
    }
  }

  .next-btn {
    width: 100%;
    padding: 10px 0;
    background: $primaryColor;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 17px;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
    &:hover {
      background: $primaryColor;
    }
  }

  .email-reset {
    display: block;
    margin: 10px auto 0 auto;
    color: $primaryColor;
    font-size: 15px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>