
<script setup>
  const close = () => {
    const box = document.querySelector('.box')
    box.classList.remove('show')
  }
</script>

<template>
    <div class="box">
      <a href="https://juejin.cn/" target="_blank" rel="noopener">
        <!-- <img> 的百分比尺寸是以最近的具有明确尺寸的祖先元素为基准进行计算的。 -->
         <!-- <a> 没有明确的 width/height，因此 <img> 实际上是以 .box 的宽高为基准来计算大小的。 -->
        <img src="@\assets\images\jj_top_advt.png" alt="">  
      </a>
      <button class="close" @click="close">x</button>
    </div>

</template>

<style scoped lang="scss">
  .box {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 38.8px;
    background-color: green;
    a {
      // width: 80%;
      // height: 100%;
      display: block;
      flex: 1;
    }
    
  }
  img {
    width: 100%;
    height: 100%;
    // 覆盖容器
    object-fit: cover;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    background-color: transparent;
    border: none;
    height: 38px;
    width: 38px;
    font-size: 20px;
// 合法值包括：
// 关键字：normal（默认值，等同于 400）、bold（加粗，等同于 700）
// 数字：100, 200, 300, 400, 500, 600, 700, 800, 900
    font-weight: 100;
    color: white;
    z-index: 700;
  }
  .close:hover {
      cursor: pointer;
    }
</style>