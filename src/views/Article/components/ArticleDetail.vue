<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/apis/article'
import { formatTime } from '@/utils/formatTime'
import { renderMarkdown } from '@/utils/markdown' // 引入 Markdown 渲染函数

const route = useRoute()
const articleContent = ref(null)
const articleContentLoading = ref(true)

// 渲染 Markdown 内容
const articleContentRendered = computed(() => {
  if (!articleContent.value?.content) return ''
  return renderMarkdown(articleContent.value.content)
})

// 获取文章详情
const getArticleContentDetail = async () => {
  try {
    articleContentLoading.value = true
    console.log('route.params.id', route.params.id)
    const { data } = await articleApi.getArticleDetail(route.params.id)
    articleContent.value = data.data
    console.log('articleContent.value', articleContent.value)
    document.title = `${articleContent.value.title} - TJLogs`
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    articleContentLoading.value = false
  }
}

onMounted(getArticleContentDetail)
</script>

<template>
  <div class="article-content-container">
    <!-- 加载状态 -->
    <div v-if="articleContentLoading" class="article-content-loading">
      <el-skeleton :rows="10" animated />
    </div>
    
    <!-- 文章详情 -->
    <article v-else-if="articleContent" class="article-content">
      <!-- 文章头部 -->
      <header class="article-content-header">
        <h1 class="article-content-title">{{ articleContent.title }}</h1>
        <div class="article-content-meta">
          <span class="article-content-author">{{ articleContent.author }}</span>
          <span class="article-content-publish-time">{{ formatTime(articleContent.createTime) }}</span>
          <span class="article-content-view-count">
            <i class="iconfont icon-eye"></i>
            {{ articleContent.viewCount.toLocaleString() }}
          </span>
          <span class="article-content-read-time">
            <i class="iconfont icon-clock"></i>
            阅读{{ Math.ceil((articleContent.content?.length || 0) / 400) }}分钟
          </span>
        </div>
      </header>

      <!-- 文章内广告 -->
      <div class="article-ad-container">
        <div class="article-ad-box">
          <span class="article-ad-text">编程不再"断片"！Trae 智能记忆历史会话，一键继续，工作流更连贯。</span>
          <a href="https://www.trae.cn" target="_blank" class="article-ad-btn">
            立即体验
            <i class="iconfont icon-right"></i>
          </a>
        </div>
      </div>

      <!-- 文章正文 -->
      <div class="article-content-body">
        <!-- 注意使用v-html渲染markdown内容，不然会被转义 -->
        <div 
          class="markdown-body" 
          v-html="articleContentRendered"
        ></div>
      </div>
    </article>

    <!-- 错误状态 -->
    <div v-else class="article-content-error-state">
      <p>文章加载失败或不存在</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-content-container {
  width: 100%;
  padding: 20px;
  background: #fff;
  min-height: 100vh;
  border-radius: 10px;
}

.article-content-loading {
  padding: 40px 0;
}

.article-content {
  .article-content-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e4e6ea;

    .article-content-title {
      font-size: 32px;
      font-weight: 700;
      color: #1d2129;
      line-height: 1.3;
      margin: 0 0 16px 0;
      word-wrap: break-word;
    }

    .article-content-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 14px;
      color: #8a919f;
      flex-wrap: wrap;

      .article-content-author {
        color: #1d2129;
        font-weight: 500;
      }

      .article-content-view-count,
      .article-content-read-time {
        display: flex;
        align-items: center;
        gap: 4px;

        .iconfont {
          font-size: 12px;
          line-height: 1;
          vertical-align: middle;
        }
      }
    }
  }

  .article-ad-container {
    margin: 24px 0;
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
    border-radius: 8px;
    padding: 16px 20px;
    color: white;

    .article-ad-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .article-ad-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
      }

      .article-ad-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s;
        //用于控制元素内部文本的空白字符处理和换行行为
        white-space: nowrap;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .iconfont {
            // 居中实现不了，不知道为什么，直接用定位解决
            position: relative;
            top: 1px;
            font-size: 10px;
        }
      }
    }
    // 媒体查询响应式设计
    @media (max-width: 768px) {
      .article-ad-box {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
    }
  }

  .article-content-body {
    line-height: 1.8;
    color: #1d2129;
  }
}

.article-content-error-state {
  text-align: center;
  padding: 60px 20px;
  color: #8a919f;
}

// 响应式设计
@media (max-width: 768px) {
  .article-content-container {
    padding: 16px;
  }

  .article-content .article-content-header .article-content-title {
    font-size: 24px;
  }

  .article-content .article-content-header .article-content-meta {
    font-size: 12px;
    gap: 12px;
  }
}
</style>
