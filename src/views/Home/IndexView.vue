<script setup>
import { ref } from 'vue';
import HomeArticle from './components/HomeArticle.vue';
const leftNavItemList = ref([
  {
    label: '关注',
    path: 'follow',
    icon: 'icon-heart-fill'
  },
  {
    label: '综合',
    path: 'comprehensive',
    icon: 'icon-plus-square'
  },
  {
    label: '后端',
    path: 'backend',
    icon: 'icon-border-top',
    active: true
  },
  {
    label: '前端',
    path: 'frontend',
    icon: 'icon-border-top'
  },
  {
    label: 'Android',
    path: 'android',
    icon: 'icon-android-fill'
  },
  {
    label: 'iOS',
    path: 'ios',
    icon: 'icon-applepingguo'
  },
  {
    label: '人工智能',
    path: 'ai',
    icon: 'icon-jiqiren_o'
  },
  {
    label: '开发工具',
    path: 'tools',
    icon: 'icon-gongju'
  },
  {
    label: '代码人生',
    path: 'career',
    icon: 'icon-tushu'
  },
  {
    label: '阅读',
    path: 'reading',
    icon: 'icon-tushu'
  },
  {
    label: '排行榜',
    path: 'ranking',
    icon: 'icon-tushu'
  }
])
</script>

<template>
  <div class="seccondViewBox">
    <!-- 左侧导航 -->
    <div class="leftNavContainer"> 
      <div class="leftNavBox" > 
        <div v-for="(item,index) in leftNavItemList" :key="item.label" :index="index" class="leftNavItemBox">
          <RouterLink :to="item.path">
            <div class="leftNavItem">
              <i class="iconfont" :class="item.icon"></i>
              <span class="leftNavItemLabel">{{ item.label }}</span>
            </div>          
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- 文章内容 -->
    <RouterView />
    <!--  -->
  </div>

</template>

<style scoped lang="scss">
.seccondViewBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start; // 添加这行，让子项不自动拉伸
  margin-top: 20px;
}
// 左侧导航
.leftNavContainer {
  width: 160px;
  // height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 5px 3px 5px 5px;
  border-radius: 5px;
  .leftNavBox {
    width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
// 字体样式
.leftNavItemBox {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 3px;
  a {
    width: 100%;
    height: 100%;
     // 使用 :not() 伪类排除激活状态
    &:hover:not(.active) {
      background-color: rgba(rgb(84, 81, 81), .1);
      color: $primaryColor;
      // 要单独设置下，被后面的样式覆盖了，不然不会变色
      .iconfont {
        color: $primaryColor;
      }
    }
      .leftNavItem {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 5px;
        border-radius: 5px; // 给所有项目添加圆角
      .iconfont {
        font-size: 1.1rem;
        margin-right: 10px;
        color: rgba(0, 0, 0, 0.5);
      }
      .leftNavItemLabel {
        font-size: 1.1rem;
      }
    }    
  }
}
.active {
  background-color: rgba($primaryColor, .1);
  color: $primaryColor;
  border-radius: 5px;
}
</style>
