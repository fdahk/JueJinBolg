<!-- 文章列表组件 - 根据路由参数获取不同分类的文章数据 -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/apis/article.js'  // 导入 API

const route = useRoute()
const articlesList = ref([]) // 文章列表
const isLoading = ref(false) // 加载状态
const activeTab = ref('recommend') // 推荐 | 最新

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

// 切换选项卡
const handleTabClick = (tabType) => {
  activeTab.value = tabType
  getArticleList()
}

// 获取文章列表
const getArticleList = async () => {
  isLoading.value = true // 加载状态
  try {
    const categoryPath = route.path.split('/').pop() || 'comprehensive'
    
    // 根据选项卡调用不同接口
    let response
    if (activeTab.value === 'recommend') {
      response = await articleApi.getRecommendArticles({
        category: categoryPath === 'comprehensive' ? '' : categoryPath,
        limit: 20
      })
    } else {
      response = await articleApi.getLatestArticles({
        category: categoryPath === 'comprehensive' ? '' : categoryPath,
        limit: 20
      })
    }

    // console.log('response', response) // debug
    if (response.data.code === 200) {
      // console.log('API返回的原始数据:', response.data)
      articlesList.value = response.data.data
    } else {
      console.error('获取文章失败:', response.message)
    }
  } catch (error) {
    console.error('catch获取文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return ''
  
  try {
    const time = new Date(timeString)
    
    // 检查日期是否有效
    if (isNaN(time.getTime())) {
      return timeString // 如果无法解析，返回原始字符串
    }
    
    const now = new Date()
    const diff = now - time
    
    // 确保diff是正数
    if (diff < 0) {
      return time.toLocaleDateString('zh-CN')
    }
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    
    return time.toLocaleDateString('zh-CN')
  } catch (error) {
    console.error('时间格式化错误:', error, timeString)
    return timeString
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

// 组件挂载
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
      color: $primaryColor;
    }
    &.active {
      color: $primaryColor;
      font-weight: 600;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: $primaryColor;
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
    color: $primaryColor;
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
      color: $primaryColor;
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
