<script>
// import { RouterLink } from 'vue-router';

</script>

<template>
    <div class="box">
      <a href="https://juejin.cn/" target="_blank" rel="noopener">
        <!-- <img> 的百分比尺寸是以最近的具有明确尺寸的祖先元素为基准进行计算的。 -->
         <!-- <a> 没有明确的 width/height，因此 <img> 实际上是以 .box 的宽高为基准来计算大小的。 -->
        <img src="@\assets\images\ad.png" alt="广告位招租">  
      </a>
      
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
      width: 80%;
      height: 100%;
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
    // 覆盖容器
    object-fit: covr;
  }
</style>