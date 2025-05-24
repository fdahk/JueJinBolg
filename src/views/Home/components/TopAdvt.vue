<!-- <script setup> 是 Vue 3 中引入的一种语法糖，它基于 Vue 3 的 Composition API -->
 <!-- 作用： 启用组合式 API
允许你在不使用 setup() 函数的情况下直接使用 Composition AP，自动暴露给模板
在 <script setup> 中定义的变量、函数会自动暴露给 <template> 使用，无需 return。 -->
<script setup>
// import { RouterLink } from 'vue-router';
  const close = () => {
    const box = document.querySelector('.box')
    box.classList.height = 0;
  }
</script>

<template>
    <div class="box">
      <a href="https://juejin.cn/" target="_blank" rel="noopener">
        <!-- <img> 的百分比尺寸是以最近的具有明确尺寸的祖先元素为基准进行计算的。 -->
         <!-- <a> 没有明确的 width/height，因此 <img> 实际上是以 .box 的宽高为基准来计算大小的。 -->
        <img src="@\assets\images\ad.png" alt="">  
      </a>

      <button class="close" @click="close">x</button>
    </div>

</template>

<style scoped lang="scss">
  .box {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: green;
    a {
      // width: 80%;
      // height: 100%;
      display: block;
      flex: 1;
    }
    .close {
      width: 40px;
    }
    .close:hover {
      cursor: pointer;
    }
  }
  img {
    width: 100%;
    height: 100%;
    // 覆盖容器
    object-fit: cover;
  }
</style>