<!-- 文章列表组件 - 根据路由参数获取不同分类的文章数据 -->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { articleApi } from '@/apis/article.js'  // 导入 API
import { valid } from '@hapi/joi'

const route = useRoute()
const router = useRouter()
const articlesList = ref([]) // 文章列表
const isLoading = ref(false) // 首次加载状态
const isLoadingMore = ref(false) // 加载更多状态
const activeTab = ref('recommend') // 推荐 | 最新

// 分页参数
const pagination = ref({
  page: 1,
  limit: 20,
  hasMore: true, // 是否还有更多数据
  total: 0
})

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

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

// 重置分页数据
const resetPagination = () => {
  pagination.value = {
    page: 1,
    limit: 20,
    hasMore: true,
    total: 0
  }
  articlesList.value = []
}

// 切换选项卡
const handleTabClick = (tabType) => {
  activeTab.value = tabType
  resetPagination()
  getArticleList(true) // 重新加载
}

// 获取文章列表
const getArticleList = async (isRefresh = false) => {
  // 如果正在加载或没有更多数据，直接返回
  if ((isLoadingMore.value && !isRefresh) || (!pagination.value.hasMore && !isRefresh)) {
    return
  }

  // 设置加载状态
  if (isRefresh || pagination.value.page === 1) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const categoryPath = route.path.split('/').pop() || 'comprehensive'
    
    // 根据选项卡调用不同接口
    let response
    if (activeTab.value === 'recommend') {
      response = await articleApi.getRecommendArticles({
        category: categoryPath === 'comprehensive' ? '' : categoryPath,
        limit: 10,
        page: pagination.value.page,
      })
    } else {
      response = await articleApi.getLatestArticles({
        category: categoryPath === 'comprehensive' ? '' : categoryPath,
        limit: 10,
        page: pagination.value.page,
      })
    }

    // console.log('response', response) // debug
    if (response.data.code === 200) {
      // 获取文章列表数据
      const articles = response.data.data.list || response.data.data
      
      if (isRefresh || pagination.value.page === 1) {
        articlesList.value = articles
      } else {
        articlesList.value.push(...articles)  // 加载更多时追加数据
      }

      // 更新分页数据
      pagination.value.page++
      pagination.value.total = response.data.data.total || 0
      pagination.value.hasMore = articles.length === parseInt(10)  // 判断是否还有更多数据
      // console.log('pagination.value.hasMore', pagination.value.hasMore) // debug
    } else {
      console.error('获取文章失败:', response.message)
    }
  } catch (error) {
    console.error('catch获取文章失败:', error)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

// 滚动加载更多
const handleScroll = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  
  // 距离底部还有 800px 时开始加载
  const threshold = 800
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold
  
  // 没有更多数据时，不触发
  if (isNearBottom && !isLoadingMore.value && pagination.value.hasMore) {
    console.log('触发加载更多')
    getArticleList()
  }
}, 200)

// 手动加载更多
const loadMore = () => {
  if (!isLoadingMore.value && pagination.value.hasMore) {
    getArticleList()
  }
}

// 下拉刷新
const handleRefresh = () => {
  resetPagination()
  getArticleList(true)
}


// 点击文章
const handleArticleClick = (article) => {
  console.log('点击文章:', article.title)
  console.log('article', article.id)
}

// 监听路由变化
watch(() => route.path, () => {
  resetPagination()
  getArticleList(true)
}, { immediate: false })

// 监听选项卡变化，第一个参数必须是函数形式，原理是需要函数来动态获取值，而非=传入的静态值
watch(() => activeTab.value, () => {
  resetPagination()
  getArticleList(true)
})

// 组件挂载
onMounted(() => {
  // 初始加载
  getArticleList(true)
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
})

// 组件卸载
onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
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
      
      <!-- 刷新按钮 -->
      <div class="refreshBtn" @click="handleRefresh" title="刷新">
        <i class="iconfont icon-refresh" :class="{ rotating: isLoading }"></i>
      </div>
    </div>

    <!-- 初次加载状态 -->
    <div v-if="isLoading && articlesList.length === 0" class="loadingBox">
      <div class="loadingSpinner"></div>
      <div class="loadingText">加载中...</div>
    </div>

    <!-- 文章列表 -->
    <div v-else class="articleListBox">
      <RouterLink 
        v-for="(article, index) in articlesList" 
        :key="`${article.articleId}`"
        :to="`/api/article/${article.articleId}`" 
        target="_blank"
        class="articleItemBox"
      >
        <div 
          class="articleItemBox" 
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
            <img 
              :src="article.coverImg" 
              :alt="article.title"
              loading="lazy"
            />
          </div>
        </div>
      </RouterLink>
      <!-- 加载更多状态 -->
      <div class="loadMoreBox">
        <!-- 正在加载更多 -->
        <div v-if="isLoadingMore" class="loadingMore">
          <div class="loadingSpinner small"></div>
          <span>加载更多...</span>
        </div>
        
        <!-- 手动加载更多按钮 -->
        <div 
          v-else-if="pagination.hasMore " 
          class="loadMoreBtn"
          @click="loadMore"
        >
          点击加载更多
        </div>
        
        <!-- 没有更多数据 -->
        <div v-else-if="!pagination.hasMore " class="noMoreText">
          没有更多文章了
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!isLoading && articlesList.length === 0" class="emptyBox">
      <div class="emptyIcon">📝</div>
      <div class="emptyText">暂无文章</div>
      <div class="emptySubText">换个分类试试吧</div>
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
  position: relative;
  
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
  
  .refreshBtn {
    margin-left: auto;
    padding: 12px 16px;
    cursor: pointer;
    color: #8a9aa9;
    transition: color 0.3s;
    
    &:hover {
      color: #1e80ff;
    }
    
    .iconfont {
      font-size: 16px;
      transition: transform 0.3s;
      
      &.rotating {
        animation: rotate 1s linear infinite;
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loadingBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 12px;
  
  .loadingText {
    color: #8a9aa9;
    font-size: 14px;
  }
}

.loadingSpinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e80ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  &.small {
    width: 20px;
    height: 20px;
    border-width: 2px;
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
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.loadMoreBox {
  padding: 20px 0;
  text-align: center;
  
  .loadingMore {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #8a9aa9;
    font-size: 14px;
  }
  
  .loadMoreBtn {
    display: inline-block;
    padding: 8px 20px;
    background-color: #f7f8fa;
    color: #1e80ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #e8f3ff;
    }
  }
  
  .noMoreText {
    color: #c2c8d1;
    font-size: 14px;
  }
}

.emptyBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  gap: 12px;
  
  .emptyIcon {
    font-size: 48px;
    opacity: 0.5;
  }
  
  .emptyText {
    color: #8a9aa9;
    font-size: 16px;
    font-weight: 500;
  }
  
  .emptySubText {
    color: #c2c8d1;
    font-size: 14px;
  }
}
</style>
