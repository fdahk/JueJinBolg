<script setup>
 import { ref } from 'vue'
 const showCreatorMenue = ref(false)
  const changeCreatorMenue = () => {
    showCreatorMenue.value = !showCreatorMenue.value
  }
  // 隐藏创作者中心功能
  const props = defineProps({
    creatorContainerShow: {
      type: Boolean,
      default: true
    }
  })
</script>

<template>
  <div class="creatorCenterContainer" :class="{active: creatorContainerShow === false}">
    <div class="creatorCenterBox">
      <button>创作者中心</button>
      <el-icon class=" creatorCenterIconBox" @click="changeCreatorMenue">
        <CaretBottom class="creatorCenterIcon down"/>
        <CaretTop class=" creatorCenterIcon up"/>
      </el-icon>
      
    </div>
  </div>
</template>

<style scoped lang="scss">
  .creatorCenterContainer {
    width:  102px;
    height:  100%;
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 20px;
    transition: 0;
    &.active {
      opacity: 0;
      visibility: hidden;
      width: 0;
      margin-left: 0;
    }
    .creatorCenterBox {
      width:  100%;
      height:  80%;
      background-color: $primaryColor;
      display: flex;
      align-items: center;
      button {
        background-color: $primaryColor;
        border: none;
        height: 100%;
        padding-left: 8px;
        padding-right: 8px;
        border-right: solid 1px rgba(255, 255, 255, 0.3);
        color: white;
        margin-right: 3px;
        cursor: pointer;
        &:hover {
          background-color: rgba(55, 92, 188, 0.8);
        }
      }
      .creatorCenterIconBox{
        height: 100%; flex: 1; 
        display: flex; 
        align-items: center;
        cursor: pointer;
        position: relative;
        transition: .5s ease;
        &:hover {
          background-color: rgba(55, 92, 188, 0.8);
        }
      }
      .creatorCenterIcon {
        width: .8rem; 
        height: .8rem; 
        color: white;

         
      }
      .up {
        opacity: 0;
      }
      .down {
        opacity: 1;
        position: absolute;
      }      
      &:hover {
        .up {
          opacity: 1;
        }
        .down {
          opacity: 0;
        }
      }
    }

  }
</style>