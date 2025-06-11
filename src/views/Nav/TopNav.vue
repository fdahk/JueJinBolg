<script setup>
// 引入vue组件时，不要少了文件后缀，回报错
import userCenter from './components/userCenter.vue'
import creatorCenter  from './components/creatorCenter.vue'
import userNotice from './components/userNotice.vue'
import openLogin from './components/openLogin.vue'
import navSearch from './components/navSearch.vue'
import { ref,defineProps,onMounted,onUnmounted } from 'vue'
import { getSearchContents, getHistoryList } from '@/apis/search'
import { useLoginStore } from '@/stores/login'
import { useUserStore } from '@/stores/user'
import router from '@/router'
const userStore = useUserStore()
// 与登录页数据通信
const handleOpenLogin = () => {
  useLoginStore().openLogin()
}
// 与搜索组件数据交互
const showHistory = ref(false)
// 触发changeHistory的同时隐藏创作者中心
const showCreatorContainer = ref(true)
const changeHistory = (value) => {
  showHistory.value = value
  showCreatorContainer.value = !showHistory.value
}
// 滚动隐藏
const showTopNav = ref(true)
const handleScroll = () => {
  // 后面那个监测老版本的浏览器
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (scrollTop > 10) {
    showTopNav.value = false
  } else {
    showTopNav.value = true
  }
}
onMounted(() => {
  // console.log('TopNav component mounted at:', new Date().getTime()); //测试该组件重复渲染问题
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  // console.log('TopNav component unmounted.'); // 测试该组件重复渲染问题
  window.removeEventListener('scroll', handleScroll)
})
// vue数据驱动渲染
const navItems = [
  { label: '首页', path: '/'},
  { label: '课程', path: '/course'}
]
</script>

<template>
  <div class="top" :class="{active: showTopNav === false}">
    <div class="nav">
      <RouterLink to="/" class="logoBox">
        <img class="logo" src="@\assets\images\juejin.png" alt="">
      </RouterLink>
      <ul>
        <!-- 哎，这个样式其实实现的不好-->
        <li v-for="(item, index) in navItems" :key=index>
          <!-- 已配置路由精确匹配时自动添加 active 类 -->
          <RouterLink :to="item.path">{{ item.label }}</RouterLink>
        </li>
      </ul>
      <navSearch :showHistory="showHistory" @changeHistory="changeHistory"/>
      <creatorCenter :showCreatorContainer="showCreatorContainer"/>
      <userNotice />
      <userCenter v-show="userStore.isLogin"/>
      <openLogin @handleOpenLogin="handleOpenLogin" v-show="!userStore.isLogin"/>

    </div>
  </div>

</template>

<style scoped lang="scss">
  .top {
    // 关键，只能是这个定位
    // 会出现遮挡她下面的元素，或者难以实现动态隐藏等问题
    position: sticky;
    // 无法触发，这个100%是整个视口的高度，一直是relative
    // top: -100%;
    top: 40px;
    background-color: white;
    width: 100%;
    transition: .3s;
    z-index: 100;
    &.active {
      transform: translate3d(0, -100%, 0);
    }
  }
  .logoBox {
    position: relative;
    height: 100%;
    .logo {
      // 完美解决图片超出问题
      height: 100%;
      margin-right: 10px;
    }    
  }

  .nav {
    display: flex;
    position: relative;
    padding-left: 150px;
    padding-right: 150px;
    height: 50px;
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
      //不能写死宽，内容不确定，a标签的padding会覆盖li的padding
      // padding: 0 10px 0 10px;
      display: flex;
      align-items: center;
      font-size: .9rem;
      // 移除 cursor: pointer，因为 a 标签本身就有点击效果
    }
      a {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      // 将 padding 移到 a 标签，让整个 padding 区域都可以点击
      // padding: 0 10px;
      margin: 0 10px;
      // 确保 a 标签占据整个 li 的空间,没有其时也可以
      // width: 100%;
    }
    // 嵌套使用，处于hover状态时，激发after
    a.active {
      color: $primaryColor;
    }

    a:hover::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      // 现在 a 标签已经设置了 position: relative，width 100% 会基于 a 标签的宽度
      width: 100%;
      border-bottom: $primaryColor 2px solid;
    } 
  }
 
</style>