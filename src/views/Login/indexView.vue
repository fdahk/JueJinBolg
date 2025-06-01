<script setup>
import { ref } from 'vue';
import http from '@/utils/http';

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

// 登录方法
const handleLogin = async () => {
  try {
    const res = await http.post('/api/login', loginForm.value);
    console.log(res.data);
    // 这里可以添加登录成功后的逻辑，如跳转页面
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 注册方法
const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    console.log('两次输入的密码不一致');
    return;
  }
  try {
    const res = await http.post('/api/register', {
      username: registerForm.value.username,
      password: registerForm.value.password
    });
    console.log(res.data);
    // 这里可以添加注册成功后的逻辑，如提示用户
  } catch (error) {
    console.error('注册失败:', error);
  }
};
</script>

<template>
  <div>
    <!-- 登录表单 -->
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="loginForm.username" type="text" placeholder="用户名" required />
      <input v-model="loginForm.password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>

    <!-- 注册表单 -->
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="registerForm.username" type="text" placeholder="用户名" required />
      <input v-model="registerForm.password" type="password" placeholder="密码" required />
      <input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" required />
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
/* 可以在这里添加样式 */
</style>