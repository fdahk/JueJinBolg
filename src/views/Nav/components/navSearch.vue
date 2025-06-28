<script setup>
//写了boolean自动引入了这个
// import { bool, boolean } from '@hapi/joi';
import { ref,defineEmits, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import searchHistory from '@/utils/searchRecord.js'

const router = useRouter()
const userStore = useUserStore()
const emit = defineEmits(['changeHistory']);
const props = defineProps({
  // type 使用了 @hapi/joi 的 boolean ，这是不正确的。在 Vue 里， props 类型应该直接使用 JavaScript 的原生类型Boolean 。
  showHistory: {
    type: Boolean,
    default: false
  }
})
// 搜索框数据绑定
const searchQuery = ref('')
// const searchContents = ref() // 不用
const historyList = ref([])
const showHistory = ref(false)
const searchInput = ref(null)
const historySearch = ref(null)
// 执行搜索
const handleSearch = async () => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return

  try {
    // 保存搜索历史
    const newHistory = await searchHistory.save(keyword)
    historyList.value = newHistory

    // 跳转搜索页面，直接通过URL传递查询参数，在搜索结果页查询
    router.push({
      path: '/search',
      query: { searchQuery: keyword }
    })

    // 隐藏历史记录
    searchInput.value.blur() //应该通过触发blur来触发显示转换函数，而不是直接赋值
    // showHistory.value = false  // 不能用这个，直接修改值，但焦点属性没变，导致异常
    
  } catch (error) {
    console.error('搜索失败:', error)
  }
}

// 加载历史数据
const loadHistoryData = async () => {
  try {
    // 加载历史记录
    const [history] = await Promise.all([
      searchHistory.getHistory()
    ])
    
    historyList.value = history
  } catch (error) {
    console.error('加载搜索数据失败:', error)
  }
}

// 删除历史记录
const handleDeleteHistory = async (keyword) => {
  try {
    const newHistory = await searchHistory.remove(keyword)
    historyList.value = newHistory
  } catch (error) {
    console.error('删除历史记录失败:', error)
  }
}

// 清空所有历史
const handleClearHistory = async () => {
  try {
    const newHistory = await searchHistory.remove()
    historyList.value = newHistory
  } catch (error) {
    console.error('清空历史记录失败:', error)
  }
}

// 显示/隐藏历史记录
const toggleHistory = () => {
  // console.log("执行了") // 测试
  if(document.activeElement !== searchInput.value) {
    showHistory.value = false
  } else {
    showHistory.value = true
  }
  if (showHistory.value) {
    loadHistoryData()
  }
}

// 点击历史记录
const useSearchHistory = (keyword) => {
  searchQuery.value = keyword
  handleSearch()
}

// 点击事件监听
const handleClick = (e) => {
  if(searchInput.value.contains(e.target) || historySearch.value.contains(e.target)) return
  // console.log("执行了监听") // 测试
  if(document.activeElement !== searchInput.value && showHistory.value) {
    toggleHistory()
  }
}

// 初始化
onMounted(async () => {
  // 设置用户ID
  if (userStore.isLogin && userStore.userPhone) {
    searchHistory.setUserPhone(userStore.userPhone)
  }
  // 加载搜索历史
  await loadHistoryData()
  // 
  document.addEventListener('click', handleClick)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <!-- container要写高度，防止子元素撑大容器，导致变形 -->
   <!-- 怎么解决浏览器的自动填充啊 -->
  <div class="container" :class="{active: showHistory === true}">
    <div ref="searchBox" class="searchBox" :class="{active: showHistory === true}">
      <input 
      ref="searchInput"
      type="search" placeholder="请输入搜索内容" 
      v-model="searchQuery" @keyup.enter="handleSearch" 
      @focus="toggleHistory"
      value=""
      autocomplete="off"
      readonly 
      onfocus="this.removeAttribute('readonly')" 
       >
    <!-- 字体图标· -->
      <div class="iconBox" :class="{active: showHistory === true}">
        <el-icon ><Search style="width: 1em; height: 1em;"/></el-icon>
      </div>
    </div>
    <!-- 历史记录容器 -->
    <div ref="historySearch" class="historySearch" v-show="showHistory">
      <div class="historyTitle">
        <span class="left">搜索历史</span>
        <span class="right">清空</span>
      </div>
      <!-- 历史记录列表 -->
      <div  class="historyList">
        <div v-for="(item, index) in historyList" :key=index class="historyContent" @click="useSearchHistory(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  //搜索框样式
  .container {
    display: flex; 
    flex-wrap: wrap;  
    height: 36px;
    width: 250px;
    transition: .3s;
    &.active {
      width: 372px;
    }
    .historySearch {
      // 会影响元素宽度，但不是过度属性，是复合属性
      // flex: 0 1 100%;
      width: 100%;
      background-color: white;
      border: 1px solid rgba(125, 121, 121, 0.1);
      box-shadow: 0 0 10px 0 rgba(125, 121, 121, 0.1);
      border-radius: 4px;
      overflow: hidden;
      //这个过渡实现不了，transition无法捕获到父级的宽度变化，width: 100% 只是被动继承计算结果，本身没有触发数值变化
      // 对父级用transition，对子级用width，可以实现过渡
      // transition: width .3s;
      .historyTitle {
        padding: 0 5px 0 10px;
        height: 25px;
        display: flex;
        align-items: center;
        border: 1px solid rgba(151, 146, 146, 0.3);
        justify-content: space-between;
        .left {
          // span默认是工字光标
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
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        border: 1px solid rgba(119, 118, 118, 0.5);
        .historyContent {
          overflow: hidden;
          padding-left: 8px;
          font-size: .9rem;
          color: rgba(0,0,0, .5);
          cursor: pointer;
          padding: 5px 8px;
          &:hover {
            background-color: rgba(119, 118, 118, 0.2);
          }
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