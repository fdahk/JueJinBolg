<script setup>
  import { ref, onMounted,onBeforeUnmount } from 'vue'
  let isVisible = ref(true)
  let timeoutId = null
  let box = ref(null)
  // 随机移动函数
  const x = ref(0)
  let moveInterval = null
  function randomPosition() {
    const width = box.value.offsetWidth
    const maxX = document.documentElement.clientWidth - width // 避免超出屏幕
    x.value = Math.random() * (maxX > 0 ? maxX : 0)
  }

  // 组件准备好后，开始计时
  onMounted(() => {
    timeoutId = setTimeout( () => {
    isVisible.value = false
    },10000)
    moveInterval = setInterval(() => {
      randomPosition()
    },500)
    
  })
  // 组件销毁时，清除计时器
  onBeforeUnmount(() => {
    clearTimeout(timeoutId)
    clearInterval(moveInterval)
  })

</script>

<template>
  <div ref="box" class="box" :style="{transform: `translate(${x}px)`}">
    <a href="">
      <img src="@\assets\images\maodie.gif" alt="">
    </a>
  </div>
</template>

<style scoped lang="scss">
  .box {
    position: absolute;
    transition: all 1s ease-in;
    bottom: 0;
    left: 200px;
  }
</style>