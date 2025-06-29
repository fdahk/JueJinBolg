<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/apis/article'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const router = useRouter()

const activeTab = ref('article') // 当前激活的标签页
const activeStatus = ref('all')// 当前激活的状态筛选
const searchKeyword = ref('')// 搜索关键字

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
}

// 切换过滤状态筛选
const switchStatus = (status) => {
  activeStatus.value = status
}

// 搜索功能
const isSearching = ref(false)
const articleSearchResult = ref([])
const draftArticleSearchResult = ref([])
const publishedArticleSearchResult = ref([])
const reviewingArticleSearchResult = ref([])
const rejectedArticleSearchResult = ref([])
const publishedDraftSearchResult = ref([])
const reviewingDraftSearchResult = ref([])
const rejectedDraftSearchResult = ref([])

// 键入自动触发搜索
const handleSearch = () => {
  isSearching.value = true
  if (activeTab.value === 'article') {
    articleSearchResult.value = articles.value.filter(item => item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    publishedArticleSearchResult.value = articleSearchResult.value.filter(item => item.status === 'published')
    reviewingArticleSearchResult.value = articleSearchResult.value.filter(item => item.status === 'reviewing')
    rejectedArticleSearchResult.value = articleSearchResult.value.filter(item => item.status === 'rejected')
  } else {
    draftArticleSearchResult.value = drafts.value.filter(item => item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    publishedDraftSearchResult.value = draftArticleSearchResult.value.filter(item => item.status === 'published')
    reviewingDraftSearchResult.value = draftArticleSearchResult.value.filter(item => item.status === 'reviewing')
    rejectedDraftSearchResult.value = draftArticleSearchResult.value.filter(item => item.status === 'rejected')
  }
}


// 跳转到写文章页面
const startWriting = () => {
  router.push('/creator/write')
}
// 获取草稿箱数据
const drafts = ref([])
const publishedDrafts = ref([])
const reviewingDrafts = ref([])
const rejectedDrafts = ref([])
const getDrafts = async () => {
  try {
    const res = await articleApi.getUserArticle({
      userPhone: userStore.userPhone,
      status: 'draft'
    })
    drafts.value = res.data.data
    publishedDrafts.value = drafts.value.filter(item => item.status === 'published')
    reviewingDrafts.value = drafts.value.filter(item => item.status === 'reviewing')
    rejectedDrafts.value = drafts.value.filter(item => item.status === 'rejected')
  } catch (error) {
    console.log(error)
  }
}
// 获取文章数据
const articles = ref([])
const publishedArticles = ref([])
const reviewingArticles = ref([])
const rejectedArticles = ref([])
const getArticles = async () => {
  try {
    const res = await articleApi.getUserArticle({
      userPhone: userStore.userPhone,
      status: 'published'
    })
    articles.value = res.data.data
    publishedArticles.value = articles.value.filter(item => item.status === 'published')
    reviewingArticles.value = articles.value.filter(item => item.status === 'reviewing')
    rejectedArticles.value = articles.value.filter(item => item.status === 'rejected')
  } catch (error) {
    console.log(error)
  }
}
// 过滤出要显示的文章
const filteredData = ref([])
filteredData.value = publishedArticles.value
watch([activeTab, activeStatus, isSearching, articles, publishedArticles, reviewingArticles,
 rejectedArticles, drafts, publishedDrafts, reviewingDrafts, rejectedDrafts, articleSearchResult,
  publishedArticleSearchResult, reviewingArticleSearchResult, rejectedArticleSearchResult, draftArticleSearchResult,
   publishedDraftSearchResult, reviewingDraftSearchResult, rejectedDraftSearchResult], () => {
  if (activeTab.value === 'article') {
   if (isSearching.value) {
    if (activeStatus.value === 'all') {
      filteredData.value = articleSearchResult.value
    } else if (activeStatus.value === 'published') {
      filteredData.value = publishedArticleSearchResult.value
    } else if (activeStatus.value === 'reviewing') {
      filteredData.value = reviewingArticleSearchResult.value
    } else if (activeStatus.value === 'rejected') {
      filteredData.value = rejectedArticleSearchResult.value
    }
   } else {
    if (activeStatus.value === 'all') {
      filteredData.value = articles.value
    } else if (activeStatus.value === 'published') {
      filteredData.value = publishedArticles.value
    } else if (activeStatus.value === 'reviewing') {
      filteredData.value = reviewingArticles.value
    } else if (activeStatus.value === 'rejected') {
      filteredData.value = rejectedArticles.value
    }
  }
  } else if (activeTab.value === 'draft') {
    if (isSearching.value) {
      if (activeStatus.value === 'all') {
        filteredData.value = draftArticleSearchResult.value
      } else if (activeStatus.value === 'published') {
        filteredData.value = publishedDraftSearchResult.value
      } else if (activeStatus.value === 'reviewing') {
        filteredData.value = reviewingDraftSearchResult.value
      } else if (activeStatus.value === 'rejected') {
        filteredData.value = rejectedDraftSearchResult.value
      }
    } else {
      if (activeStatus.value === 'all') {
        filteredData.value = drafts.value
      } else if (activeStatus.value === 'published') {
        filteredData.value = publishedDrafts.value
      } else if (activeStatus.value === 'reviewing') {
        filteredData.value = reviewingDrafts.value
      } else if (activeStatus.value === 'rejected') {
        filteredData.value = rejectedDrafts.value
      } 
    }
  }
}, { immediate: true })

onMounted( async () => {
  await getDrafts()
  await getArticles()
})

</script>

<template>
  <div class="article-manage">
    <!-- 顶部标签页 -->
    <div class="article-manage-header">
      <div class="tab-container">
        <div 
          class="tab-item"
          :class="{ 'active': activeTab === 'article' }"
          @click="switchTab('article')"
        >
          <span>文章({{ isSearching ? articleSearchResult.length : articles.length }})</span>
        </div>
        <div 
          class="tab-item"
          :class="{ 'active': activeTab === 'draft' }"
          @click="switchTab('draft')"
        >
          <span>草稿箱({{ isSearching ? draftArticleSearchResult.length : drafts.length }})</span>
        </div>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入标题关键字"
          class="search-input"
          @input="handleSearch"
        >
          <template #suffix>
            <el-icon class="search-icon" @click="handleSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 状态筛选 -->
    <div class="status-filter">
      <div 
        class="filter-item"
        :class="{ 'active': activeStatus === 'all' }"
        @click="switchStatus('all')"
      >
        全部 ({{ isSearching ? articleSearchResult.length : (activeTab === 'article' ? articles.length : drafts.length) }})
      </div>
      <div 
        class="filter-item"
        :class="{ 'active': activeStatus === 'published' }"
        @click="switchStatus('published')"
      >
        已发布 ({{ isSearching ? publishedArticleSearchResult.length : (activeTab === 'article' ? publishedArticles.length : publishedDrafts.length) }})
      </div>
      <div 
        class="filter-item"
        :class="{ 'active': activeStatus === 'reviewing' }"
        @click="switchStatus('reviewing')"
      >
        审核中 ({{ isSearching ? reviewingArticleSearchResult.length : (activeTab === 'article' ? reviewingArticles.length : reviewingDrafts.length) }})
      </div>
      <div 
        class="filter-item"
        :class="{ 'active': activeStatus === 'rejected' }"
        @click="switchStatus('rejected')"
      >
        未通过 ({{ isSearching ? rejectedArticleSearchResult.length : (activeTab === 'article' ? rejectedArticles.length : rejectedDrafts.length) }})
      </div>
    </div>

    <!-- 文章列表 / 空状态 -->
    <div class="article-container">
      <!-- 空状态 -->
      <div v-if="acriveTab === 'article' ? articles.length === 0 : drafts.length === 0" class="empty-state">
        <!-- 纯手绘的svg图标（ Scalable Vector Graphics）-->
        <div class="empty-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <!-- 蓝色主体 -->
            <ellipse cx="60" cy="85" rx="45" ry="25" fill="#E3F2FD"/>
            <path d="M25 60 Q25 35 60 35 Q95 35 95 60 L95 75 Q95 90 60 90 Q25 90 25 75 Z" fill="#64B5F6"/>
            
            <!-- 眼睛 -->
            <circle cx="45" cy="55" r="3" fill="#1976D2"/>
            <circle cx="75" cy="55" r="3" fill="#1976D2"/>
            
            <!-- 嘴巴 -->
             <!-- Q60 70 70 65 - Quadratic curve (二次贝塞尔曲线) -->
            <path d="M50 65 Q60 70 70 65" stroke="#1976D2" stroke-width="2" fill="none" stroke-linecap="round"/>
            
            <!-- 装饰元素 -->
            <circle cx="105" cy="45" r="8" fill="#FFD54F"/>
            <circle cx="15" cy="70" r="6" fill="#81C784"/>
            <circle cx="110" cy="75" r="4" fill="#FF8A65"/>
            
            <!-- 加号图标 -->
            <circle cx="85" cy="35" r="12" fill="#FFD54F"/>
            <path d="M80 35 L90 35 M85 30 L85 40" stroke="#FF8F00" stroke-width="2" stroke-linecap="round"/>
            
            <!-- 底部小圆点装饰 -->
            <circle cx="40" cy="95" r="3" fill="#BBDEFB"/>
            <circle cx="80" cy="100" r="2" fill="#C8E6C9"/>
            <circle cx="60" cy="105" r="2" fill="#FFCCBC"/>
          </svg>
        </div>
        <div class="empty-text">{{ isSearching ? '暂无搜索结果' : '这里什么都没有' }}</div>
        <el-button 
          type="primary" 
          class="start-writing-btn"
          @click="startWriting"
        >
          开始创作
        </el-button>
      </div>

      <!-- 文章列表  -->
      <div v-else class="article-list">
        <!-- 文章列表内容 -->
        <router-link  class="article-item" v-for="item in filteredData" :key="item.articleId" :to="`/api/article/${item.articleId}`">
          <div class="article-title">{{ item.title }}</div>
          <div class="article-summary">{{ item.summary }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-manage {
  padding: 24px;
  background: white;
  min-height: calc(100vh - 100px);
  width: 100%;
}

.article-manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  .tab-container {
    display: flex;
    
    .tab-item {
      position: relative;
      padding: 16px 0;
      margin-right: 32px;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      transition: color 0.3s;
      
      &:hover {
        color: #1890ff;
      }
      
      &.active {
        color: #1890ff;
        font-weight: 500;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #1890ff;
          border-radius: 1px;
        }
      }
    }
  }
  
  .search-container {
    .search-input {
      width: 280px;
      
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        box-shadow: 0 0 0 1px #d9d9d9;
        
        &:hover {
          box-shadow: 0 0 0 1px #40a9ff;
        }
        
        &.is-focus {
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }
    
    .search-icon {
      cursor: pointer;
      color: #999;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
}

.status-filter {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  
  .filter-item {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.3s;
    margin-right: 16px;
    
    &:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.06);
    }
    
    &.active {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
      font-weight: 500;
    }
  }
}


.article-container {
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    
    .empty-icon {
      margin-bottom: 24px;
      
      svg {
        filter: drop-shadow(0 4px 12px rgba(100, 181, 246, 0.2));
      }
    }
    
    .empty-text {
      font-size: 16px;
      color: #999;
      margin-bottom: 32px;
    }
    
    .start-writing-btn {
      border-radius: 6px;
      padding: 12px 32px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
      
      &:hover {
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      }
    }
  }
  
}
// 文章列表样式
.article-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .article-item {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        padding: 16px 8px;
        border-radius: 8px;
        .article-title {
            font-size: 16px;
            font-weight: 500;
        }
        .article-summary {
            font-size: 14px;
            color: #666;
        }
        &:hover {
            background: #f0f0f0;
            color: $primaryColor;
        }
    }
}
// 响应式设计
@media (max-width: 768px) {
  .article-manage {
    padding: 16px;
  }
  
  .article-manage-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    
    .search-container .search-input {
      width: 100%;
    }
  }
  
  .status-filter {
    flex-wrap: wrap;
    gap: 8px;
    
    .filter-item {
      margin-right: 0;
    }
  }
}
</style>
