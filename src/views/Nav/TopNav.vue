<script setup>
// 引入vue组件时，不要少了文件后缀，回报错
import userCenter from './components/userCenter.vue'
import creatorCenter  from './components/creatorCenter.vue'
import userNotice from './components/userNotice.vue'
import openLogin from './components/openLogin.vue'
import navSearch from './components/navSearch.vue'
import { ref,defineProps,onMounted,onUnmounted } from 'vue'
import TopAdvt from '@/views/Advt/TopAdvt.vue'
import { getSearchContents, getHistoryList } from '@/apis/search'
import { useLoginStore } from '@/stores/login'
// 用户信息
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
// 点击效果实现
const actIndex = ref(0)
const setActIndex = (index) => {
  actIndex.value = index
}
// vue数据驱动渲染
const navItems = [
  { label: '首页', path: '/'},
  { label: '课程', path: '/course'}
]



// 与登录页数据通信
const handleOpenLogin = () => {
  useLoginStore().openLogin()
}
// 与搜索组件数据交互
const showHistory = ref(false)
// 触发changeHistory的同时隐藏创作者中心
const showCreatorContainer = ref(true)
const changeHistory = (x) => {
  showHistory.value = x
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
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="top" :class="{active: showTopNav === false}">
    <div class="nav">
      <img class="logo" src="@\assets\images\juejin.png" alt="">
      <ul>
        <!-- vue数据驱动渲染 -->
        <li v-for="(item, index) in navItems" :key=index @click="setActIndex(index)">
          <RouterLink :to="item.path" :class="{active: index === actIndex}">{{ item.label }}</RouterLink>
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
  .logo {
    // 完美解决图片超出问题
    height: 100%;
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
      padding-left: 20px;
      padding-right: 10px;
      display: flex;
      align-items: center;
      font-size: .9rem;
    }
  }
  a {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }
  // 嵌套使用，处于hover状态时，激发after
  a.active::after,
  a:hover::after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 1px;
    // 由于 <li> 没有设置 position: relative，那么：
    // <li> 不会成为 ::after 的定位容器。则width 100%不是依据li的宽度的
    width: 100%;
    border-bottom: rgb(74, 138, 210) 2px solid;
  }


  
  
</style>