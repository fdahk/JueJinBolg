<!-- 可以使用标签选择器控制 el-icon 的样式，但需要注意 Vue 的作用域样式（ scoped ）特性。以下是具体实现方式及注意事项：

### 1. 在 <style scoped> 中使用标签选择器（需配合深度选择器）
由于 Vue 的 scoped 样式会为元素添加唯一的 data-* 属性（如 data-v-12345 ），
直接使用标签选择器（如 el-icon ）可能无法穿透作用域限制。此时需要通过深度选择器（ >>> , /deep/ 或 ::v-deep ）来强制样式生效
如果希望样式全局生效（不局限于当前组件），可以将样式写在未标记 scoped 的 <style> 标签中，或全局样式文件（如 src/styles/Common.scss ）中： -->

<!-- ### 利用 Vue Router 自动添加的 active 类
Vue Router 会自动为当前匹配的路由链接添加 router-link-active 类（默认类名），
你可以直接为这个类编写样式。如果需要自定义类名，可以通过 active-class 属性指定。 -->

<!-- Vue Router 的 router-link 默认使用 包含匹配 （即只要当前路径包含目标路径就会激活） -->
<script setup>
  import { ref, defineProps } from 'vue';
  // 这里不用v-for渲染navitem了
  // const navItems = [
  //   {label: '个人资料', path: '/setting/profile'},
  //   {label: '账号设置',path: '/setting/account'},
  // ]
</script>

<template> 
  <div class="leftNavContainer" >
    <div class="leftNavBox">
      <!-- 注意是空路径 -->
      <RouterLink to="/setting" active-class="active">
        <div class="navItem">
          <el-icon class="navItemIcon"><Postcard style="height: 20px; width: 20px;"/></el-icon>
          <span>个人资料</span>
        </div>
      </RouterLink>
      <!-- 注意路径 -->
      <RouterLink to="/setting/account" active-class="active">
        <div class="navItem">
          <el-icon class="navItemIcon"><UserFilled style="height: 20px; width: 20px;"/></el-icon>
          <span>账号设置</span>
        </div>
      </RouterLink>      
    </div>
  </div>
</template>

<style scoped lang="scss">
  .leftNavContainer {
    // 下滑页面时隐藏topNav时需要移动，只能用这个定位
    position: sticky;
    
    top: 90px; // key
    width: 250px;
    // height: 100%; //细节100%，不能写固定高度，滚动时由父容器推着他向上移动，不对，100%也不行
    height: 100%;
    background-color: white;
    border-radius: 5px;
  }
  .leftNavBox {
    display: flex;
    flex-direction: column;
    padding: 20px;
    a.active {
      background-color: rgba($primaryColor, .1)  ;
      color: $primaryColor; ;
    }
    .navItem {
      display: flex;
      align-items: center;
      justify-content:start;
      padding: 10px;
      // border-radius: 8px; //无效
      // overflow: hidden //无效
      .navItemIcon {
        margin-right: 10px; 
        display: flex; 
        align-items: center;
      }
      span {
        line-height: px;
      }
    }
  }
</style>