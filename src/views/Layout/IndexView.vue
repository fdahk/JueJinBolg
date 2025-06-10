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
// 这个二级路由的容器，高度有内容撑开，所以不需要设置高度
// 注意父级项目的html、body、app的布局方案
.seccondViewContainer {
  // height: calc(100vh - 88.8px); // 减去顶部导航栏和底部广告栏的高度
  // height: 100%;
  margin-left: 250px;
  margin-right: 250px;
}
</style>