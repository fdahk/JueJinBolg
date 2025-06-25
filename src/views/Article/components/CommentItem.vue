<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted, reactive } from 'vue'
import { formatRelativeTime } from '@/utils/formatTime'
import { userArticleApi } from '@/apis/userArticle'
import { useUserStore } from '@/stores/user'
import InputComment from './InputComment.vue'

const userStore = useUserStore()

const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    articleInfo: {
        type: Object,
        required: true
    },
    articleId: {
        type: [String, Number],
        required: true
    }
})

const emits = defineEmits(['updateComment'])

// 1级评论数据
const commentData = reactive({
    list: [],
    total: 0,
    level: 1,
    loading: false,
    hasMore: true,
    page: 1,
    limit: 5,
})

// 获取1级评论列表
const getComments = async (reset = false) => {
    // 分类
    const sort = 'likeCount'
    try {
        commentData.loading = true
        const res = await userArticleApi.getComments(props.articleId, {
            // 注意用value获取
            page:  commentData.page,
            limit: commentData.limit,
            sort: sort,
            level: 1,
            parentId: props.comment.commentId
        })
        if (res.data.code === 200) {
            commentData.list.push(...res.data.list)
            commentData.total = res.data.total
            commentData.hasMore = res.data.hasMore
            commentData.page += 1
        }        
    } catch(error) {
        console.error('获取评论失败:', error)
    } finally {
        commentData.loading = false // 最后记得标记状态
    }

}
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

// 回复相关状态
const showReplyContainer = ref(false)
const replyRefs = ref({})
const setReplyRef = (el, commentId) => {
    if (el) {
        replyRefs.value[commentId] = el
    } else {
        delete replyRefs.value[commentId]
    }
}

// 监听回复框状态变化
watch(showReplyContainer, async () => {
  if (showReplyContainer.value) {
    //Vue提供的API，在下次DOM更新循环结束之后执行延迟回调，Vue的响应式更新是异步的
    // 等待 DOM 更新完成
    await nextTick()
    // 聚焦输入框
    if (replyRefs.value[showReplyContainer.value] && replyRefs.value[showReplyContainer.value].focus) {
      replyRefs.value[showReplyContainer.value].focus()
    }
  }
})

// 点击外部关闭回复框的处理函数
const handleClickOutside = (event) => {
  if (!showReplyContainer.value) return
    // console.log(replyRefs.value[showReplyContainer.value]) // 调试
  if (replyRefs.value[showReplyContainer.value]) {
    if (!replyRefs.value[showReplyContainer.value].$el.contains(event.target)) {
      // 检查是否有内容，没有内容才关闭
      if (!replyRefs.value[showReplyContainer.value].commentForm.content.trim()) {
        showReplyContainer.value = false
      }
    }
  }
}




// 更新1级评论和2级评论
const updateComment = (comment) => {
    commentData.list.push(comment)
    commentData.total += 1
    commentData.hasMore = commentData.total > commentData.list.length
    commentData.page += 1
}


onMounted(() => {
    getComments()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

</script>

<template>
<div class="comment-item-box">
    <!-- 评论头像 -->
        <div class="comment-item-box-left">
        <div class="comment-pic">
            <img :src="comment.userPic" />
        </div>                        
        </div>
    <!-- 评论内容 -->
        <div class="comment-item-box-right">
        <div class="first-comment-content-container">
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
                    @click.stop="showReplyContainer = comment.commentId"
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
                :ref="el => setReplyRef(el, comment.commentId)"
                :key="comment.commentId"
                :articleId="articleId" 
                :parentId="comment.commentId"
                :level="1"
                @updateComment="updateComment" 
            />
        </div> 

        <!-- 1级评论 -->
         <!-- 因为最多只有二级评论，直接把上面评论的样式全复制一遍，再微调下 -->
        <div class="second-list-container">

            <!-- 一级评论右侧评论内容 -->
            <div class="second-comment-container" v-for="item in commentData.list" :key="item.commentId">
                <!-- 一级评论左侧头像 -->
                <div class="second-comment-left">
                    <div class="comment-pic">
                        <img :src="item.userPic" />
                    </div>                        
                </div>
                <!-- 一级评论右侧评论内容 -->
                <div class="second-comment-right">
                    <!-- 用户信息 -->
                    <div class="comment-user">
                        <span class="username">{{ item.userName }}</span>
                        <span v-if="item.userPhone == articleInfo.userPhone" class="user-title">作者</span>
                        <!-- 评论内容，和名字同行 -->
                         <span v-if="item.parentName!='test' && item.parentName!=null" class="parent-name">   回复 {{ item.parentName }}</span>
                        <span class="comment-text" > : {{ item.content || "渲染异常" }}</span>                        
                    </div>

                    <!-- 评论交互按钮 -->
                    <div class="comment-actions">
                        <!-- 时间 -->
                        <span class="comment-time">{{ formatRelativeTime(item.createTime) }}</span>
                        <!-- 点赞 -->
                        <button 
                            class="action-btn like-btn"
                            :class="{ liked: item.isLiked }"
                            @click="handleCommentLike(item)"
                        >
                            <span class="icon"><i class="iconfont icon-like-fill"></i></span>
                            <span v-if="item.likeCount > 0" class="count">{{ item.likeCount }}</span>
                            <span v-else>点赞</span>
                        </button>
                        <!-- 回复 -->
                        <button 
                            class="action-btn reply-btn" 
                            @click.stop="showReplyContainer = item.commentId"
                            :ref="el => setReplyRef(el, item.commentId)"
                        >
                            <span class="icon"><i class="iconfont icon-message-fill"></i></span>
                            <span v-if="item.replyCount > 0" class="count">{{ item.replyCount }}</span>
                            <span v-else>回复</span>
                        </button>
                    </div>
                    <!-- 回复框 -->
                    <div  class="reply-container" v-if="showReplyContainer === item.commentId">
                        <InputComment 
                            :ref="el => setReplyRef(el, item.commentId)"
                            :key="item.commentId"
                            :articleId="articleId" 
                            :parentId="props.comment.commentId"
                            :level="1" 
                            :parentName="item.userName"
                            @updateComment="updateComment" 
                        />
                    </div> 
                </div>
            </div>
        </div>
    </div>

</div>    
</template>

<style scoped lang="scss">
.comment-item-box {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    width: 100%;
    // border-bottom: 1px solid #f1f2f3;

    // 0级评论布局
    .comment-item-box-left {
        display: flex;
        width: 40px;
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
    }
    .comment-item-box-right {
        flex: 1;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
}

// 一级和二级的公共样式
// 评论文本样式
.comment-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #1a1a1a;
    margin-bottom: 12px;
    // 文本溢出处理
    // min-width: 0; //无效
    word-wrap: break-word; //强制长单词换行，防止单词超出容器边界，这是较老的属性，主要用于兼容性
    overflow-wrap: break-word;//这是 word-wrap 的现代标准版本，功能与 word-wrap: break-word 完全相同
    white-space: pre-wrap;//控制空白符（空格、换行符、制表符）的处理方式，pre-wrap = 保留空白符 + 允许换行
    // width: 100%;
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

// 评论（0级评论
.first-comment-content-container {
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

}

// 一级评论
.second-list-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    // 一级评论容器（包含左侧头像和右侧评论内容）
    .second-comment-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-bottom: 8px;
        // 一级评论左侧头像
        .second-comment-left {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
            .comment-pic {
                flex-shrink: 0;
                width: 30px;
                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
        // 一级评论右侧评论内容
        .second-comment-right {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            flex-direction: column;
            margin-left: 10px;
            .comment-user {
                display: flex;        
                width: 100%;
            .username {
                font-size: 1.1rem;
                font-weight: 800;
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
                font-size: 1.1rem;
                color: #8a919f;
                background: #f1f2f3;
                padding: 2px 6px;
                border-radius: 3px;
                flex-shrink: 0;
            }    
            .comment-text {
                flex: 1 1 0; // 这个必须有，第三个参数保证其宽度可以被压缩，不会被文本撑开导致容器变大挤压兄弟元素
                // word-wrap: break-word;
                // overflow-wrap: break-word; //与word-wrap: break-word 完全相同
                // white-space: pre-wrap;
                word-break: break-all; // 允许在单词内换行,这个解决了问题，
                margin-bottom: 0px; //覆盖上面公共样式的下边距
            }
        }
        }
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


</style>