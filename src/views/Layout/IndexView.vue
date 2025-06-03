<script setup>
import TopNav from '@/views/Nav/TopNav.vue';
import BottomAdvt from '@/views/Advt/BottomAdvt.vue';
import loginView from '@/views/Login/indexView.vue';
// 登录页状态
import { useLoginStore } from '@/stores/login';
</script>

<template>
  <TopNav />
  <BottomAdvt />
  <loginView v-show="useLoginStore().showLogin"/>
  <Router-view/>
</template>
