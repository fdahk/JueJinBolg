<script setup>
import TopAdvt from '@/views/Advt/TopAdvt.vue'
</script>

<template>
  <div class="top">
    <TopAdvt />
    <div class="nav">
      <img class="logo" src="@\assets\images\juejin.png" alt="">
      <ul>
        <li><router-link to="">首页 </router-link></li>
        <li><router-link to="/course">课程 </router-link></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      
      
    </div>
  </div>

</template>

<style scoped lang="scss">
  .top {
    position: fixed;
    background-color: white;
  }
  .logo {
    // 完美解决图片超出问题
    height: 100%;
  }
  .nav {
    display: flex;
    padding-left: 200px;
    padding-right: 200px;
    height: 60px;
    align-items: center;
  }
  ul {
    display: flex;
    align-items: center;
    width: 500px;
    height: 100%;
    li {
      position: relative;
      height: 100%;
      padding-left: 20px;
      padding-right: 10px;
      display: flex;
      align-items: center;
    }
  }
  a {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }
  a::after {
    content: '';
    position: absolute;
    bottom: 0;

    height: 1px;
    // 由于 <li> 没有设置 position: relative，那么：
    // <li> 不会成为 ::after 的定位容器。则width 100%不是依据li的宽度的
    width: 100%;
    border-bottom: rgb(74, 138, 210) 2px solid;

  }
</style>