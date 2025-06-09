<script setup>
import TopNav from '@/views/Nav/TopNav.vue';
import BottomAdvt from '@/views/Advt/BottomAdvt.vue';
import loginView from '@/views/Login/indexView.vue';
import TopAdvt from '../Advt/TopAdvt.vue';
// 登录页状态
import { useLoginStore } from '@/stores/login';
</script>

<template>
  <TopAdvt />
  <TopNav />
  
  <loginView v-show="useLoginStore().showLogin"/>
  <!-- 二级路由出口 -->
   <div class="seccondViewContainer">
      <RouterView />
   </div>
  <!-- <BottomAdvt /> -->
</template>

<style scoped lang="scss">
.seccondViewContainer  {
  // width: 100%;
  height: 100%; //这个100%比实际上要高
  margin-left: 250px;
  margin-right: 250px;
}
</style>