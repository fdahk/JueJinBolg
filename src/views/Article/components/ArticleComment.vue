<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import { userArticleApi } from '@/apis/userArticle'
import { articleApi } from '@/apis/article'
import { useUserStore } from '@/stores/user'
import { formatRelativeTime } from '@/utils/formatTime'
import InputComment from './InputComment.vue'
import CommentItem from './CommentItem.vue'
const userStore = useUserStore()

// 父组件传递文章ID
const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  },
  articleInfo: {
    type: Object,
    required: true
  }
})

// 一级评论数据
// 最热评论区数据
const hotCommentData = reactive({
  list: [],
  level: 0,
  total: 0,  // 一级评论总数
  loading: false,
  hasMore: true,
  page: 1,
  limit: 5
})

// 最新评论数据
const newestCommentData = reactive({
  list: [],
  level: 0,
  total: 0,
  loading: false,
  hasMore: true,
  page: 1,
  limit: 5,
})


// 当前类别评论数据，watch 或 computed 实现和 sortType 关联
// 计算属性只读，不能修改
// 执行时机： 1.初次访问 2.依赖的响应式数据变化 并且再次访问时
const nowCommentData = computed(() => {
  return sortType.value === 'hot' ? hotCommentData : newestCommentData
})

// 更新评论
const updateComment = (comment) => {
    hotCommentData.list.unshift(comment)
    newestCommentData.list.unshift(comment)
    hotCommentData.total += 1
    newestCommentData.total += 1
}

// 排序类别
const sortType = ref('hot') // 'hot' | 'newest'

// 获取评论列表
const getComments = async (reset = false, sortType) => {
    // 分类
    const sort = sortType === 'hot' ? 'likeCount' : 'createTime'
    try {
        nowCommentData.value.loading = true
        const res = await userArticleApi.getComments(props.articleId, {
            // 需要用value获取
            page:  nowCommentData.value.page,
            limit: nowCommentData.value.limit,
            sort: sort,
            level: 0,
            parentId: 0
        })
        if (res.data.code === 200) {
            nowCommentData.value.list.push(...res.data.list)
            nowCommentData.value.total = res.data.total
            nowCommentData.value.hasMore = res.data.hasMore
            nowCommentData.value.page += 1
        }        
    } catch(error) {
        console.error('获取评论失败:', error)
    } finally {
        nowCommentData.value.loading = false // 最后记得标记状态
    }

}

// 切换排序
const changeSort = (type) => {
  if (sortType.value === type) return
  sortType.value = type
  if (type === 'hot' && hotCommentData.list.length === 0) {
    getComments(true, 'hot')

  } else if (type === 'newest' && newestCommentData.list.length === 0) {
    getComments(true, 'newest')
  }
}

// 加载更多评论
const loadMore = () => {
  if (!nowCommentData.value.hasMore || nowCommentData.value.loading) return
  getComments(false, sortType.value)
}

// 组件挂载时获取评论
onMounted(() => {
  getComments(true, 'hot')
})

// 组件卸载时移除事件监听
onUnmounted(() => {
})
</script>

<template>
  <div class="article-comment-container">
    <div class="article-comment-box">
        <!-- 评论标题 -->
        <div class="comment-header">
        <h3 class="comment-title">评论 {{ nowCommentData.total }}</h3>
        </div>

        <!-- 评论输入（0级评论） -->
        <div class="comment-input-container">
            <!-- 用户头像 -->
            <div class="user-pic">
                <img :src="userStore.userPic || '' " :alt="userStore.userName" />
            </div>
            <InputComment :articleId="articleId" :level="0" :parentId=0 @updateComment="updateComment" />
        </div>

        <!-- tab切换排序 -->
        <div class="comment-sort-container">
            <button 
                class="sort-btn"
                :class="{ active: sortType === 'hot' }"
                @click="changeSort('hot')"
            >
                最热
            </button>
            <button 
                class="sort-btn"
                :class="{ active: sortType === 'newest' }"
                @click="changeSort('newest')"
            >
                最新
            </button>
        </div>

        <!-- 评论区 -->
        <div class="comment-list-container">
            <!-- 加载0级评论 -->
            <div 
                v-for="comment in nowCommentData.list" 
                :key="comment.commentId"
                class="comment-item-container"
            >
                <!-- 加载0级评论 -->
                <CommentItem 
                    :comment="comment" 
                    :articleInfo="articleInfo"
                    :articleId="articleId"
                    @updateComment="updateComment"
                />
            </div>

            <!-- 加载更多 -->
            <div v-if="nowCommentData.hasMore" class="load-more">
                <button 
                class="load-more-btn"
                :disabled="nowCommentData.loading"
                @click="loadMore"
                >
                {{ nowCommentData.loading ? '加载中...' : `加载更多评论` }}
                </button>
            </div>

            <!-- 无评论 -->
            <div v-if="nowCommentData.list.length === 0 && !nowCommentData.loading" class="no-comments">
                <p>暂无评论，快来发表第一条评论吧~</p>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-comment-container {
    width: 100%;
    padding: 20px 0;
    .article-comment-box {
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
    }
}

.comment-header {
    margin-bottom: 20px;
    .comment-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    }
}

// 用户头像
.user-pic {
    flex-shrink: 0;
    margin-right: 12px;
    img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    }  
}

// 评论输入容器
.comment-input-container {
    display: flex;
    width: 100%;
    margin-bottom: 24px;
    padding: 16px;
    background: white;
}

// tab切换排序
.comment-sort-container {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f2f3;
  padding-bottom: 12px;
}

.sort-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #8a919f;
  cursor: pointer;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s;

    .sort-btn.active {
    color: #007fff;
    font-weight: 600;
    }  

    .sort-btn.active::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 0;
    right: 0;
    height: 2px;
    background: #007fff;
    }    
}


// 评论区容器
.comment-list-container {
    margin-top: 20px;
    // 评论实例
    .comment-item-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid #f1f2f3;
    // 最后一项的样式    
    .comment-item-container:last-child {
        border-bottom: none;
    }
    }
}


// 加载更多
.load-more {
    text-align: center;
    margin-top: 20px;
    .load-more-btn {
        background: none;
        border: 1px solid #e4e6ea;
        color: #8a919f;
        padding: 8px 24px;
        border-radius: 20px;
        cursor: pointer;
        font-size: .9rem;
        transition: all 0.2s;
    } 

    .load-more-btn:hover:not(:disabled) {
        border-color: $primaryColor;
        color: $primaryColor;
    }

    .load-more-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    }    
}


// 无评论
.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #8a919f;
    .no-comments p {
    margin: 0;
        font-size: .9rem;
    }  
}


// 响应式设计

</style>