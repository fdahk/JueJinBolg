<!-- 文章列表组件 - 根据路由参数获取不同分类的文章数据 -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const articlesList = ref([])
const isLoading = ref(false)
const activeTab = ref('recommend') // recommend | latest

// 分类配置映射
const categoryMap = {
  'comprehensive': { label: '综合', icon: 'icon-plus-square' },
  'follow': { label: '关注', icon: 'icon-heart-fill' },
  'backend': { label: '后端', icon: 'icon-border-top' },
  'frontend': { label: '前端', icon: 'icon-border-top' },
  'android': { label: 'Android', icon: 'icon-android-fill' },
  'ios': { label: 'iOS', icon: 'icon-applepingguo' },
  'ai': { label: '人工智能', icon: 'icon-jiqiren_o' },
  'tools': { label: '开发工具', icon: 'icon-gongju' },
  'career': { label: '代码人生', icon: 'icon-tushu' },
  'reading': { label: '阅读', icon: 'icon-tushu' },
  'ranking': { label: '排行榜', icon: 'icon-tushu' }
}

// 获取当前分类
const getCurrentCategory = computed(() => {
  const currentPath = route.path.split('/').pop() || 'comprehensive'
  return categoryMap[currentPath] || categoryMap['comprehensive']
})

// 模拟数据
const articleDate = {
  comprehensive: [
    {
      id: 1,
      title: '前端项目如何接入deepseek',
      summary: '前端项目接入 DeepSeek 主要有以下步骤3：注册与获取 API Key：访问DeepSeek API 官...',
      author: 'whisper',
      viewCount: '2.9k',
      likeCount: 10,
      coverImg: '',
      tagList: ['前端'],
      publishTime: '2小时前'
    },
    {
      id: 2,
      title: '外卖平台每天有1000万笔订单查询怎么优化?',
      summary: '1. 业务场景与挑战 每日订单量1000万级，数据规模呈指数级增长； 年度数据量达36亿条 单...',
      author: '爱吃饭武当',
      viewCount: '2.2k',
      likeCount: 10,
      coverImg: '',
      tagList: ['后端'],
      publishTime: '3小时前'
    },
    {
      id: 3,
      title: '老板：实现一下王者荣耀里的这个数据雷达图，不要用echarts',
      summary: '办公室的空调嗡作响，我正目着屏幕敲代码，冷不丁老板拉着平板大步流星走过来，把屏幕...',
      author: 'JYeontu',
      viewCount: '528',
      likeCount: 3,
      coverImg: '',
      tagList: ['JavaScript', '前端', 'Canvas'],
      publishTime: '5小时前'
    },
    {
      id: 4,
      title: 'DeepSeek为什么现在感觉不火了?',
      summary: '作为一个在AI圈摸爬滚打多年的技术从业者，看到这个问题，我想从几个维度来聊聊DeepSeek这个现象级产品的起...',
      author: '王马扎',
      viewCount: '1.9k',
      likeCount: 10,
      coverImg: '',
      tagList: ['人工智能'],
      publishTime: '6小时前'
    },
    {
      id: 5,
      title: '思维导图前端实现',
      summary: '目的： 值得思维导图的互动操作，让用户更深入地参与到学习内容中。要求：第一个层级的...',
      author: '用户800052697569',
      viewCount: '1.1k',
      likeCount: 12,
      coverImg: '',
      tagList: ['前端'],
      publishTime: '8小时前'
    },
    {
      id: 6,
      title: '你知道有哪些不常用，但非常有用的css属性吗? 😎😎😎',
      summary: '以下是 10 个 CSS 不常用但非常有用的属性，它们能解决特定场景下的复杂问题，甚至替代部...',
      author: 'Felix',
      viewCount: '2.1k',
      likeCount: 46,
      coverImg: '',
      tagList: ['前端', 'CSS'],
      publishTime: '10小时前'
    },
    {
      id: 7,
      title: 'Web Worker：前端也能多线程骄车 🚀',
      summary: '"为什么我的页面一跑复杂计算就卡成PPT？" 这是很多前端开发者都经历过的灵魂拷问。本文将带你彻底搞懂Web...',
      author: '酒试人生',
      viewCount: '2.3k',
      likeCount: 29,
      coverImg: '',
      tagList: ['JavaScript', '前端'],
      publishTime: '12小时前'
    }
  ]
}

// 切换选项卡
const handleTabClick = (tabType) => {
  activeTab.value = tabType
  getArticleList()
}

// 获取文章列表
const getArticleList = async () => {
  isLoading.value = true
  try {
    // 模拟接口请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const categoryPath = route.path.split('/').pop() || 'comprehensive'
    
    // 这里根据分类和选项卡调用不同接口
    console.log(`加载 ${categoryPath} 分类的 ${activeTab.value} 文章`)
    
    // 模拟数据获取，实际使用时替换为真实接口
    let dataList = articleDate[categoryPath] || articleDate['comprehensive']
    
    // 根据选项卡处理数据
    if (activeTab.value === 'latest') {
      dataList = [...dataList].reverse()
    }
    
    articlesList.value = dataList
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 点击文章
const handleArticleClick = (article) => {
  console.log('点击文章:', article.title)
  // 这里可以跳转到文章详情页
}

// 监听路由变化
watch(() => route.path, () => {
  getArticleList()
}, { immediate: true })

onMounted(() => {
  getArticleList()
})
</script>

<template>
  <div class="articleContainer">
    <!-- 顶部选项卡 -->
    <div class="tabContainer">
      <div 
        class="tabItem" 
        :class="{ active: activeTab === 'recommend' }"
        @click="handleTabClick('recommend')"
      >
        推荐
      </div>
      <div 
        class="tabItem" 
        :class="{ active: activeTab === 'latest' }"
        @click="handleTabClick('latest')"
      >
        最新
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loadingBox">
      <div class="loadingText">加载中...</div>
    </div>

    <!-- 文章列表 -->
    <div v-else class="articleListBox">
      <div 
        class="articleItemBox" 
        v-for="article in articlesList" 
        :key="article.id"
        @click="handleArticleClick(article)"
      >
        <div class="articleContentBox">
          <h3 class="articleTitle">{{ article.title }}</h3>
          <p class="articleSummary">{{ article.summary }}</p>
          
          <div class="articleMetaBox">
            <span class="authorName">{{ article.author }}</span>
            <span class="statsItem">
              <i class="iconfont icon-eye"></i>
              {{ article.viewCount }}
            </span>
            <span class="statsItem">
              <i class="iconfont icon-thumb-up"></i>
              {{ article.likeCount }}
            </span>
            <span class="moreBtn">
              <i class="iconfont icon-more"></i>
            </span>
          </div>

          <div class="articleFooterBox">
            <div class="tagListBox">
              <span 
                v-for="tag in article.tagList" 
                :key="tag" 
                class="tagItem"
              >
                {{ tag }}
              </span>
            </div>
            <span class="publishTime">{{ article.publishTime }}</span>
          </div>
        </div>

        <div class="articleCoverBox" v-if="article.coverImg">
          <img :src="article.coverImg" :alt="article.title" />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!isLoading && articlesList.length === 0" class="emptyBox">
      <div class="emptyText">暂无文章</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.articleContainer {
  padding: 0 20px;
  width: 700px;
  margin-left: 20px;
  background-color: white;
  border-radius: 5px;
}

.tabContainer {
  display: flex;
  border-bottom: 1px solid #e4e6e9;
  margin-bottom: 20px;
  .tabItem {
    padding: 12px 16px;
    font-size: 16px;
    color: #8a9aa9;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
    &:hover {
      color: #1e80ff;
    }
    &.active {
      color: #1e80ff;
      font-weight: 600;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: #1e80ff;
        border-radius: 1px;
      }
    }
  }
}

.loadingBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .loadingText {
    color: #8a9aa9;
    font-size: 14px;
  }
}

.articleListBox {
  .articleItemBox {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #e4e6e9;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    &:last-child {
      border-bottom: none;
    }
  }
}

.articleContentBox {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 16px;
}

.articleTitle {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  line-height: 1.5;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &:hover {
    color: #1e80ff;
  }
}

.articleSummary {
  font-size: 13px;
  color: #8a9aa9;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.articleMetaBox {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  .authorName {
    font-size: 13px;
    color: #8a9aa9;
  }
  .statsItem {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #8a9aa9;
    .iconfont {
      font-size: 12px;
    }
  }
  .moreBtn {
    margin-left: auto;
    color: #c2c8d1;
    cursor: pointer;
    &:hover {
      color: #8a9aa9;
    }
  }
}

.articleFooterBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tagListBox {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    .tagItem {
      padding: 2px 8px;
      background-color: rgba(30, 128, 255, 0.1);
      color: #1e80ff;
      font-size: 12px;
      border-radius: 4px;
    }
  }
  .publishTime {
    font-size: 12px;
    color: #c2c8d1;
    white-space: nowrap;
  }
}

.articleCoverBox {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.emptyBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .emptyText {
    color: #8a9aa9;
    font-size: 14px;
  }
}
</style>
