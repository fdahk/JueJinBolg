<script setup> 
import { ref,defineEmits } from 'vue'
const emit = defineEmits(['handleOpenLogin']);
const handleOpenLogin = () => {
  emit('handleOpenLogin')
}
</script>

<template>
  <div class="openLoginContainer">
    <div class="openLoginBox" @click="handleOpenLogin">
      <button class="openLoginBoxLeft">
        登录
      </button>
      <button class="openLoginBoxRight"> 
        注册
      </button>
    </div>    
  </div>

</template>

<style scoped lang="scss">
  .openLoginContainer {
    height: 100%;
    display: flex;
    align-items: center;
    // position: absolute;
    // right: 0;
    margin-left: auto;
    
  }
  .openLoginBox {
    display: flex;
    align-items: center;
    height: 36px;
    border: 1px solid rgba(89, 87, 87, 0.5);
    border-radius: 4px;
    padding: 0 8px 0 8px;
    background-color: rgba(122, 134, 174, 0.1);
    .openLoginBoxLeft  {
      height: 1rem;
      line-height: 0;
      padding-right: 3px;
      border-right: 1px solid rgba(43, 42, 42,.5);
      border-color: $primaryColor;
      background-color: rgba(98, 119, 187, 0);
      color: $primaryColor;
    }
    .openLoginBoxRight  {
      height: 1rem;
      line-height: 0;
      padding-left: 3px;
      background-color: rgba(98, 119, 187, 0);
      color: $primaryColor;
    }
  }
</style>