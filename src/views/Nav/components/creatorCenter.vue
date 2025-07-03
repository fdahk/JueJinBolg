<script setup>
 import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
 // 创作者中心下拉菜单的显示与隐藏
 const showCreatorMenue = ref(false)
  const toShowCreatorMenue = () => {
    showCreatorMenue.value = true
  }
  const toHideCreatorMenue = () => {
    showCreatorMenue.value = false
  }
  // 隐藏创作者中心功能
  const props = defineProps({
    showCreatorContainer: {
      type: Boolean,
      default: true
    }
  })

const toCreatorCenter = () => {
  router.push('/creator/center')
}
</script>

<template>
  <div class="creatorCenterContainer" :class="{active: showCreatorContainer === false}">
    <div class="creatorCenterBox">
      <button @click="toCreatorCenter">创作者中心</button>
      <el-icon class=" creatorCenterIconBox" @mouseenter="toShowCreatorMenue" @mouseleave="toHideCreatorMenue">
        <CaretBottom class="creatorCenterIcon down"/>
        <CaretTop class=" creatorCenterIcon up"/>
      </el-icon>
    </div>
    <div class="creator-menue" v-show="showCreatorMenue" @mouseenter="toShowCreatorMenue" @mouseleave="toHideCreatorMenue">
      <div class="creator-menue-header">
        <RouterLink class="creator-menue-item" to="/creator/write">
          <span class="icon"><i class="iconfont icon-edit"></i></span>
          <span>写文章</span>
        </RouterLink>
        <RouterLink class="creator-menue-item" to="/creator/draftBox">
          <span class="icon"><i class="iconfont icon-delete"></i></span>
          <span>草稿箱</span>
        </RouterLink>
        <RouterLink class="creator-menue-item" to="/creator/draftBox">
          <span class="icon"><i class="iconfont icon-delete"></i></span>
          <span>待开发</span>
        </RouterLink>
        <RouterLink class="creator-menue-item" to="/creator/draftBox">
          <span class="icon"><i class="iconfont icon-delete"></i></span>
          <span>待开发</span>
        </RouterLink>
      </div>
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
      width:  102px;
      height:  80%;
      background-color: $primaryColor;
      display: flex;
      align-items: center;
      position: absolute;
      }
  }

//创作者中心按钮
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
// 下拉菜单按钮
.creatorCenterIconBox{
  height: 100%; flex: 1; 
  display: flex; 
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: .5s ease;
  //扩展按钮鼠标离开事件的判定范围
  &::after {
    content: '';
    width: 102px;
    height: 20px;
    position: absolute;
    right: 0;
    top: 100%;
  }
  &:hover {
    background-color: rgba(55, 92, 188, 0.8);
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
// 下拉菜单
.creator-menue {
  position: absolute;
  top: 101%;
  right: 0;
  background-color: white;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  // width: 100%;
  .creator-menue-header {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    // gap: 10px;
    padding: 8px 8px;
    border-bottom: 1px solid #ccc;
  }
  .creator-menue-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    cursor: pointer;
    padding: 5px 5px;
    color: rgba(0, 0, 0, 0.7);
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .icon {
    .iconfont {
      font-size: 1.5rem;
      color: $primaryColor;
    }
  }
}
</style>