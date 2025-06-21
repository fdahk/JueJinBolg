<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import { userArticleApi } from '@/apis/userArticle'
import { articleApi } from '@/apis/article'
import { useUserStore } from '@/stores/user'

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
  list: [

  ],
  total: 0,  // 一级评论总数
  loading: false,
  hasMore: true,
  page: 1,
  limit: 5,
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

// 评论内容公共参数
const commentForm = reactive({
  content: '',
  maxLength: 1000
})


// 排序类别
const sortType = ref('hot') // 'hot' | 'newest'


// 字数统计
const wordCount = computed(() => {
  return commentForm.content.length
})

// 获取评论列表
const getComments = async (reset = false, sortType) => {
    // 分类
    const sort = sortType === 'hot' ? 'likeCount' : 'createTime'
    try {
        nowCommentData.value.loading = true
        const res = await userArticleApi.getComments(props.articleId, {
            // nowCommentData是计算属性，需要用value获取
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

// 发送评论
const submitComment = async () => {

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

// 格式化时间
const formatTime = (time) => {
}

// 组件挂载时获取评论
onMounted(() => {
  getComments(true, 'hot')
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
        <div class="comment-input-box">
            <!-- 用户头像 -->
            <div class="user-pic">
                <img :src="userStore.userPic || '' " :alt="userStore.userName" />
            </div>
            <!-- 评论输入框 -->
            <div class="input-content-container" >
                <!-- 评论输入 -->
                <textarea
                    v-model="commentForm.content"
                    :maxlength="commentForm.maxLength"
                    placeholder="平等表达，友善交流"
                    class="input-content-textarea"
                    rows="3"
                ></textarea>
                <!-- 评论输入框底部 -->
                <div class="input-footer">
                    <div class="other-btn">
                    <button class="emoji-btn" title="表情"><i class="iconfont icon-smile-fill"></i></button>
                    <button class="image-btn" title="图片"><i class="iconfont icon-image-fill"></i></button>
                    </div>
                    <div class="send-comment-container">
                    <span class="word-count">{{ wordCount }} / {{ commentForm.maxLength }}</span>
                    <button 
                        class="send-comment"
                        :disabled="!commentForm.content.trim()"
                        @click="submitComment"
                    >
                        发送
                    </button>
                    </div>
                </div>
            </div>
        </div>
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
                class="comment-item"
            >
                <div class="comment-pic">
                    <img :src="comment.userPic || '/default-pic.png'" />
                </div>
                <div class="comment-content-container">
                    <!-- 用户信息 -->
                    <div class="comment-user">
                        <span class="username">{{ comment.userName }}</span>
                        <span v-if="comment.userPhone == articleInfo.userPhone" class="user-title">作者</span>
                    </div>
                    <!-- 评论内容 -->
                    <div class="comment-text">{{ comment.content }}</div>
                    <!-- 评论交互按钮 -->
                    <div class="comment-actions">
                        <!-- 时间 -->
                        <span class="comment-time">{{ comment.createTime }}</span>
                        <!-- 点赞 -->
                        <button 
                            class="action-btn like-btn"
                            :class="{ liked: comment.isLiked }"
                        >
                            <span class="icon"><i class="iconfont icon-like-fill"></i></span>
                            <span v-if="comment.likeCount > 0" class="count">{{ comment.likeCount }}</span>
                        </button>
                        <!-- 回复 -->
                        <button class="action-btn reply-btn">
                            <span class="icon"><i class="iconfont icon-message-fill"></i></span>
                        </button>
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

// 字体图标
.iconfont {
    font-size: 1.3rem;
    color: rgba(128, 128, 128, 0.7);
    &:hover {
        color: $primaryColor;
    }
}

// 评论输入容器
.comment-input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    .comment-input-box {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }
}

// 用户头像
.user-pic {
    flex-shrink: 0;

    img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    }  
}

// 评论输入框
.input-content-container {
    flex: 1;
    background-color: rgba(240, 237, 237, 0.5);
    border: solid 1px rgba(240, 237, 237, 0.5);
    border-radius: 6px;    
    &:focus-within {
        border-color: $primaryColor;
        background-color: white;
    }      
    // 评论输入
    .input-content-textarea {
        width: 100%;
        height: 80px;
        padding: 12px;
        background-color: transparent;        
        resize: none; // 大小不可调整
        border: none;
        font-size: .9rem;
        font-weight: 400;
        line-height: 1.4;
        outline: none; // 去除默认的聚焦边框
        transition:  .4s;
        &:focus {
            height: 150px;
        }
    }
    
    // 评论输入框底部
    .input-footer {
        display: flex;
        background-color: transparent;
        justify-content: space-between;
        align-items: center;
        // padding-top: 8px;
        // 输入框底部按钮
        .other-btn {
            display: flex;
            gap: 8px;
            .emoji-btn, .image-btn {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
            }

            .emoji-btn:hover, .image-btn:hover {
            background-color: #f0f0f0;
            }    
        }    
    }
    // 发送评论
    .send-comment-container {
        display: flex;
        align-items: center;
        gap: 12px;
        .word-count {
        font-size: 12px;
        color: #8a919f;
        }

        .send-comment {
            background: $primaryColor;
            color: white;
            border: none;
            padding: 6px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: 0.2s;
        }
        // 悬停时且非禁用
        .send-comment:hover:not(:disabled) {
            filter: brightness(.9);
        }

        .send-comment:disabled {
            background: #c9cdd4;
            cursor: not-allowed;
        }        
    }
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
}

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

// 评论区容器
.comment-list-container {
    margin-top: 20px;
    // 评论实例
    .comment-item {
        display: flex;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid #f1f2f3;
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
    .comment-item:last-child {
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


// 响应式设计

</style>