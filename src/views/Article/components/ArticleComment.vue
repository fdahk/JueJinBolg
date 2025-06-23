<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import { userArticleApi } from '@/apis/userArticle'
import { articleApi } from '@/apis/article'
import { useUserStore } from '@/stores/user'
import { formatRelativeTime } from '@/utils/formatTime'
import InputComment from './InputComment.vue'
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

// 最热评论区数据
const hotCommentData = reactive({
  list: [],
  total: 0,  // 一级评论总数
  loading: false,
  hasMore: true,
  page: 1,
  limit: 5
})

// 最新评论数据
const newestCommentData = reactive({
  list: [],
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

// 通过子组件更新评论
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
            sort: sort
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


//评论交互功能

// 点赞
const handleCommentLike = async (comment) => {
  try {
    const res = await userArticleApi.toggleCommentLike(props.articleId, comment.commentId, comment.isLiked ? 'unlike' : 'like', userStore.userPhone)
    if (res.data.code === 200) {
      comment.isLiked = !comment.isLiked
      comment.likeCount += comment.isLiked ? 1 : -1
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 回复评论
const showReplyContainer = ref(null)
const replyRefs = ref({}) // 存储多个 ref
// 打开时默认聚焦
// 动态 ref 设置
const setReplyRef = (el, commentId) => {
  if (el) {
    replyRefs.value[commentId] = el 
  } else {
    //delete 删除对象的属性
    delete replyRefs.value[commentId]
  }
}

// 监听回复框状态变化
watch(showReplyContainer, async (newVal) => {
  if (newVal) {
    //Vue提供的API，在下次DOM更新循环结束之后执行延迟回调，Vue的响应式更新是异步的
    // 等待 DOM 更新完成
    await nextTick()
    // 获取对应评论的组件实例
    const targetComponent = replyRefs.value[newVal]
    if (targetComponent && targetComponent.focus) {
      targetComponent.focus()
    }
  }
})

// 点击外部关闭回复框的处理函数
const handleClickOutside = (event) => {
  if (!showReplyContainer.value) return
  
  const replyComponent = replyRefs.value[showReplyContainer.value]
  if (replyComponent) {
    // 获取组件的DOM元素
    const replyElement = replyComponent.$el
    if (replyElement && !replyElement.contains(event.target)) {
      // 检查是否有内容，如果没有内容才关闭
      if (!replyComponent.commentForm.content.trim()) {
        showReplyContainer.value = null
      }
    }
  }
}


// 发送回复评论
const handleCommentReply = async (comment) => {
  try {
    const res = await userArticleApi.replyComment(props.articleId, comment.commentId, {
      content: commentForm.content,
      userPhone: userStore.userPhone,
      userName: userStore.userName,
      userPic: userStore.userPic,
      parentId: comment.commentId,
      level: 2
    })
    if (res.data.code === 200) {
      showSuccess('回复成功')
      commentForm.content = ''
      setTimeout(() => {
        resizeTextarea(document.querySelector('.input-content-textarea'))
      }, 0)
      comment.replyCount += 1
    }
  } catch (error) {
    console.error('回复失败:', error)
  }
}

// 组件挂载时获取评论
onMounted(() => {
  getComments(true, 'hot')
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="article-comment-container">
    <div class="article-comment-box">
        <!-- 评论标题 -->
        <div class="comment-header">
        <h3 class="comment-title">评论 {{ nowCommentData.total }}</h3>
        </div>

        <!-- 评论输入 -->
        <div class="comment-input-container">
            <!-- 用户头像 -->
            <div class="user-pic">
                <img :src="userStore.userPic || '' " :alt="userStore.userName" />
            </div>
            <InputComment :articleId="articleId" @updateComment="updateComment" />
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
            <!-- 评论列表 -->
            <div 
                v-for="comment in nowCommentData.list" 
                :key="comment.commentId"
                class="comment-item-container"
            >
                <div class="comment-item-box">
                    <!-- 评论头像 -->
                     <div class="comment-item-box-left">
                        <div class="comment-pic">
                            <img :src="comment.userPic" />
                        </div>                        
                     </div>
                    <!-- 评论内容 -->
                     <div class="comment-item-box-right">
                        <div class="comment-content-container">
                            <!-- 用户信息 -->
                            <div class="comment-user">
                                <span class="username">{{ comment.userName }}</span>
                                <span v-if="comment.userPhone == articleInfo.userPhone" class="user-title">作者</span>
                            </div>
                            <!-- 评论内容 -->
                            <div class="comment-text">{{ comment.content || "渲染异常" }}</div>
                            <!-- 评论交互按钮 -->
                            <div class="comment-actions">
                                <!-- 时间 -->
                                <span class="comment-time">{{ formatRelativeTime(comment.createTime) }}</span>
                                <!-- 点赞 -->
                                <button 
                                    class="action-btn like-btn"
                                    :class="{ liked: comment.isLiked }"
                                    @click="handleCommentLike(comment)"
                                >
                                    <span class="icon"><i class="iconfont icon-like-fill"></i></span>
                                    <span v-if="comment.likeCount > 0" class="count">{{ comment.likeCount }}</span>
                                    <span v-else>点赞</span>
                                </button>
                                <!-- 回复 -->
                                <button 
                                    class="action-btn reply-btn" 
                                    @click.stop="showReplyContainer = showReplyContainer === comment.commentId ? null : comment.commentId"
                                >
                                    <span class="icon"><i class="iconfont icon-message-fill"></i></span>
                                    <span v-if="comment.replyCount > 0" class="count">{{ comment.replyCount }}</span>
                                    <span v-else>回复</span>
                                </button>
                            </div>
                        </div>
                        <!-- 回复框 -->
                        <div class="reply-container" v-if="showReplyContainer === comment.commentId">
                            <InputComment 
                                :key="comment.commentId"
                                :ref="el => setReplyRef(el, comment.commentId)"
                                :articleId="articleId" 
                                @updateComment="updateComment" 
                            />
                        </div>                           
                     </div>

                </div>
             
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
        .comment-item-box {
            display: flex;
            gap: 12px;
            padding: 16px 0;
            // border-bottom: 1px solid #f1f2f3;
            .comment-item-box-left {
                display: flex;
            }
            .comment-item-box-right {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
        // 评论头像
        .comment-pic {
            flex-shrink: 0;
            width: 40px;
            
            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
        // 评论内容容器
        .comment-content-container {
            flex: 1;
            min-width: 0; // 防止内容溢出，该元素是flex父元素子级，默认自动扩展区域
            // 评论用户信息
            .comment-user {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                min-width: 0; // 防止内容溢出
                .username {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 200px;
                    &:hover {
                        color: $primaryColor;
                    }
                }
                .user-title {
                    font-size: 12px;
                    color: #8a919f;
                    background: #f1f2f3;
                    padding: 2px 6px;
                    border-radius: 3px;
                    flex-shrink: 0;
                }                
            }
            // 评论内容
            .comment-text {
                font-size: 14px;
                line-height: 1.6;
                color: #1a1a1a;
                margin-bottom: 12px;
                // 文本溢出处理
                // min-width: 0; //无效
                word-wrap: break-word; //强制长单词换行，防止单词超出容器边界，这是较老的属性，主要用于兼容性
                overflow-wrap: break-word;//这是 word-wrap 的现代标准版本，功能与 word-wrap: break-word 完全相同
                white-space: pre-wrap;//控制空白符（空格、换行符、制表符）的处理方式，pre-wrap = 保留空白符 + 允许换行
                width: 100%;
                // max-width: 100%;
                // 折叠
                &.collapsed {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                // 展开
                .expand-btn {
                    color: $primaryColor;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 0;
                    margin-top: 4px;
                    
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }    
            // 评论交互按钮
            .comment-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .comment-time {
                font-size: .7rem;
                color: #8a919f;
            }

            .action-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                background: none;
                border: none;
                font-size: 12px;
                color: #8a919f;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .action-btn:hover {
                background: #f1f2f3;
                color: $primaryColor;
            }

            .action-btn.liked {
                color: $primaryColor;
            }

            .action-btn .icon {
                font-size: 1.2rem;
            }

            .action-btn .text {
                font-size: .8rem;
            }

            .action-btn .count {
                font-size: .8rem;
                margin-left: 2px;
            }    
        }
    }   
    // 最后一项的样式    
    .comment-item-container:last-child {
        border-bottom: none;
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

// 回复框
.reply-container {
    
    // 大小不要变化，否则会闪烁
    // 方案一 ：无效，min属性会被原来激活状态的min覆盖
    // :deep(.input-content-textarea) {
    //     height: 80px;
    //     min-height: 80px;
    //     max-height: 80px;
    // }
    // 方案二 ：使用CSS变量
    --min-height: 80px;
    --max-height: 80px;
    :deep(.input-content-textarea) {
        height: 80px;
    }
}

// 响应式设计

</style>