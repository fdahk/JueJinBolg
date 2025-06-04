<script setup>
import userCenter from './components/userCenter.vue'
import creatorCenter  from './components/creatorCenter.vue'
import userNotice from './components/userNotice.vue'
import openLogin from './components/openLogin.vue'
import LoginView from '@/views/Login/indexView.vue'
import { ref,defineProps } from 'vue'
import TopAdvt from '@/views/Advt/TopAdvt.vue'
import { getSearchContents, getHistoryList } from '@/apis/search'
import { useLoginStore } from '@/stores/login'
// 用户信息
import { useUserStore } from '@/stores/user'
const user = useUserStore()
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
// 搜索框数据绑定
const searchQuery = ref()
const searchContents = ref()
const handleSearchQuery = async () => {
  const res = await getSearchContents({searchQuery: searchQuery.value.trim()})
  console.log(res.data)
}
const historyList = ref()
// 搜索框焦点事件
const showHistory = ref(false)
// 隐藏创作者中心
const creatorContainerShow = ref(true)
const changeHistory = () => {
  showHistory.value = !showHistory.value
  creatorContainerShow.value = !creatorContainerShow.value
}
// 与登录页数据通信
const handleOpenLogin = () => {
  useLoginStore().openLogin()
}
</script>

<template>
  <div class="top">
    <TopAdvt />
    <div class="nav">
      <img class="logo" src="@\assets\images\juejin.png" alt="">
      <ul>
        <!-- vue数据驱动渲染 -->
        <li v-for="(item, index) in navItems" :key=index @click="setActIndex(index)">
          <RouterLink :to="item.path" :class="{active: index === actIndex}">{{ item.label }}</RouterLink>
        </li>
      </ul>
      <!-- container要写高度，防止子元素撑大容器，导致变形 -->
      <div class="container" :class="{active: showHistory === true}">
        <div ref="searchBox" class="searchBox" :class="{active: showHistory === true}">
          <input type="text" placeholder="请输入搜索内容" 
          v-model="searchQuery" @keyup.enter="handleSearchQuery()" 
          @focus="changeHistory" @blur="changeHistory" >
        <!-- 字体图标· -->
          <div class="iconBox" :class="{active: showHistory === true}">
            <el-icon ><Search style="width: 1em; height: 1em;"/></el-icon>
          </div>
        </div>
        <div class="historySearch" v-show="showHistory">
          <div class="historyTitle">
            <span class="left">搜索历史</span>
            <span class="right">清空</span>
          </div>
          <!-- <div v-for="(item, index) in historyList" :key=index></div> -->
           <div class="historyList">
            <div class="historyContent">1</div>
            <div>2</div>
           </div>
        </div>
      </div>
      <creatorCenter :creatorContainerShow="creatorContainerShow"/>
      <userNotice />
      <userCenter />
      <openLogin @handleOpenLogin="handleOpenLogin" v-show="!user.token"/>

    </div>
  </div>

</template>

<style scoped lang="scss">
  .top {
    position: fixed;
    background-color: white;
    width: 100%;
  }
  .logo {
    // 完美解决图片超出问题
    height: 100%;
  }
  .nav {
    display: flex;
    position: relative;
    padding-left: 200px;
    padding-right: 200px;
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

  //搜索框样式
  .container {
    display: flex; 
    flex-wrap: wrap;  
    height: 36px;
    width: 250px;
    &.active {
      width: 372px;
    }
    .historySearch {
      flex: 0 1 100%;
      background-color: white;
      border: 1px solid rgba(119, 118, 118, 0.3);
      border-radius: 4px;
      overflow: hidden;

      .historyTitle {
        padding: 0 5px 0 10px;
        height: 25px;
        display: flex;
        align-items: center;
        border: 1px solid rgba(151, 146, 146, 0.3);
        justify-content: space-between;
        .left {
          // 奇怪，默认是工字光标
          cursor: default;
          font-size: .8rem;
          line-height: 2rem;
          color: rgba(161, 159, 159, .8);
        }
        .right {
          cursor: pointer;
          font-size: .8rem;
          line-height: 2rem;
          color: rgb(50, 107, 156);
        }
      }
      .historyList {
        border: 1px solid rgba(119, 118, 118, 0.5);
        .historyContent {
          overflow: hidden;
          padding-left: 8px;
          // border-bottom: 1px solid rgba(119, 118, 118, 0.2);
        }
      }

    }
  }
  //
  .searchBox { 
    display: flex;
    align-items: center;
    height: 36px;
    // 搜索框宽度
    width: 250px;
    border: 1px solid rgba(119, 118, 118, 0.5);
    flex-wrap: wrap;
    z-index: 5;
    transition: .3s;
    border-radius: 4px;
    // 不加溢出隐藏会导致边线缺失
    overflow: hidden;
    // 搜索框激活样式
    &.active {
        border: rgb(83, 140, 224) 1px solid;
        width: 372px;
      }
    input {  
      border: none;
      // 焦点边框样式去除
      outline: none;
      // 利用padding扩大点击范围
      padding: .6rem 0 .6rem 1rem;
      // 弹性适配
      flex: 1;
      
      // 无效，写错地方了，应该在外面的box写
      // border-radius: 50px;
    }
    .iconBox {
      padding-left: 10px;
      padding-right: 10px;
      height: 100%;
      display: flex;
      align-items: center;
      &.active {
        background-color: $primaryColor;
      }
    }
  }
  
  
</style>