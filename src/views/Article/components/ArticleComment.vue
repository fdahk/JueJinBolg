<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import { userArticleApi } from '@/apis/userArticle'
import { articleApi } from '@/apis/article'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 接收父组件传递的文章ID
const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
})

// 评论区数据
const commentData = reactive({
  list: [
    {
      id: 1,
      user: {
        id: 101,
        nickname: "前端小王子",
        userPic: "https://picsum.photos/40/40?random=1",
        level: 3,
        isAuthor: false
      },
      content: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111这篇文章写得真的很好！特别是关于Vue3响应式原理的解释，让我终于理解了ref和reactive的区别。作者的代码示例也很清晰，赞！👍",
      createTime: "2024-01-15 14:30:25",
      likeCount: 23,
      replyCount: 5,
      isLiked: false,
      level: 1, // 一级评论
      parentId: null,
      replies: [
        {
          id: 11,
          user: {
            id: 102,
            nickname: "Vue开发者",
            userPic: "https://picsum.photos/40/40?random=2",
            level: 5,
            isAuthor: true // 文章作者
          },
          content: "@前端小王子 谢谢认可！确实这两个API在实际开发中容易混淆，我后续会写更多关于Vue3的实战文章。",
          createTime: "2024-01-15 15:12:10",
          likeCount: 8,
          replyCount: 0,
          isLiked: true,
          level: 2, // 二级回复
          parentId: 1,
          replyTo: {
            id: 101,
            nickname: "前端小王子"
          }
        },
        {
          id: 12,
          user: {
            id: 103,
            nickname: "代码新手",
            userPic: "https://picsum.photos/40/40?random=3",
            level: 1,
            isAuthor: false
          },
          content: "同感！我刚学Vue3的时候也被这个坑了很久，现在总算明白了。",
          createTime: "2024-01-15 16:45:33",
          likeCount: 2,
          replyCount: 0,
          isLiked: false,
          level: 2,
          parentId: 1
        }
      ]
    },
    {
      id: 2,
      user: {
        id: 104,
        nickname: "全栈工程师",
        userPic: "https://picsum.photos/40/40?random=4",
        level: 7,
        isAuthor: false
      },
      content: "建议可以补充一下在TypeScript中如何更好地使用这些响应式API，类型推断有时候会有问题。另外，性能优化方面也可以深入讲讲。",
      createTime: "2024-01-15 13:22:18",
      likeCount: 15,
      replyCount: 2,
      isLiked: true,
      level: 1,
      parentId: null,
      replies: [
        {
          id: 21,
          user: {
            id: 102,
            nickname: "Vue开发者",
            userPic: "https://picsum.photos/40/40?random=2",
            level: 5,
            isAuthor: true
          },
          content: "@全栈工程师 好建议！TypeScript的类型推断确实是个值得深入的话题，我会考虑单独写一篇文章来详细介绍。",
          createTime: "2024-01-15 17:30:45",
          likeCount: 6,
          replyCount: 0,
          isLiked: false,
          level: 2,
          parentId: 2,
          replyTo: {
            id: 104,
            nickname: "全栈工程师"
          }
        }
      ]
    },
    {
      id: 3,
      user: {
        id: 105,
        nickname: "React转Vue的人",
        userPic: "https://picsum.photos/40/40?random=5",
        level: 4,
        isAuthor: false
      },
      content: "从React hooks转到Vue3的组合式API，感觉还是有不少相似之处的。不过Vue的响应式系统确实更加直观一些。",
      createTime: "2024-01-15 11:55:12",
      likeCount: 9,
      replyCount: 0,
      isLiked: false,
      level: 1,
      parentId: null,
      replies: []
    },
    {
      id: 4,
      user: {
        id: 106,
        nickname: "移动端开发",
        userPic: "https://picsum.photos/40/40?random=6",
        level: 2,
        isAuthor: false
      },
      content: "请问在移动端项目中使用这些API有什么需要特别注意的吗？性能方面会不会有影响？",
      createTime: "2024-01-15 10:30:50",
      likeCount: 4,
      replyCount: 1,
      isLiked: false,
      level: 1,
      parentId: null,
      replies: [
        {
          id: 41,
          user: {
            id: 107,
            nickname: "性能优化专家",
            userPic: "https://picsum.photos/40/40?random=7",
            level: 6,
            isAuthor: false
          },
          content: "移动端主要注意避免不必要的深度响应式，可以使用shallowRef和shallowReactive来优化性能。",
          createTime: "2024-01-15 12:15:28",
          likeCount: 7,
          replyCount: 0,
          isLiked: true,
          level: 2,
          parentId: 4,
          replyTo: {
            id: 106,
            nickname: "移动端开发"
          }
        }
      ]
    },
    {
      id: 5,
      user: {
        id: 108,
        nickname: "学生党",
        userPic: "https://picsum.photos/40/40?random=8",
        level: 1,
        isAuthor: false
      },
      content: "正在准备校招，这篇文章对我帮助很大！请问有推荐的Vue3练手项目吗？",
      createTime: "2024-01-15 09:45:15",
      likeCount: 12,
      replyCount: 0,
      isLiked: false,
      level: 1,
      parentId: null,
      replies: []
    }
  ],
  total: 5,  // 一级评论总数
  loading: false,
  hasMore: true
})

// 评论内容参数
const commentForm = reactive({
  content: '',
  maxLength: 1000
})


// 排序
const sortType = ref('hot') // 'hot' | 'newest'


// 字数统计
const wordCount = computed(() => {
  return commentForm.content.length
})

// 获取评论列表
const getComments = async (reset = false) => {
}

// 发送评论
const submitComment = async () => {

}

// 切换排序
const changeSort = (type) => {
  if (sortType.value === type) return
  sortType.value = type
  getComments(true)
}

// 加载更多评论
const loadMore = () => {
  if (!commentData.hasMore || commentData.loading) return
  getComments(false)
}

// 格式化时间
const formatTime = (time) => {
}

// 组件挂载时获取评论
onMounted(() => {
  getComments(true)
})
</script>

<template>
  <div class="article-comment-container">
    <div class="article-comment-box">
        <!-- 评论标题 -->
        <div class="comment-header">
        <h3 class="comment-title">评论 {{ commentData.total }}</h3>
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
                v-for="comment in commentData.list" 
                :key="comment.id"
                class="comment-item"
            >
                <div class="comment-pic">
                    <img :src="comment.user?.userPic || '/default-pic.png'" :alt="comment.user?.nickname" />
                </div>
                <div class="comment-content-container">
                    <!-- 用户信息 -->
                    <div class="comment-user">
                        <span class="username">{{ comment.user?.nickname }}</span>
                        <span v-if="comment.user?.isAuthor" class="user-title">作者</span>
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
                        <!-- 更多 -->
                        <button class="action-btn more-btn">⋯</button>
                    </div>
                </div>
            </div>

            <!-- 加载更多 -->
            <div v-if="commentData.hasMore" class="load-more">
                <button 
                class="load-more-btn"
                :disabled="commentData.loading"
                @click="loadMore"
                >
                {{ commentData.loading ? '加载中...' : `查看全部 ${commentData.total} 条评论` }}
                </button>
            </div>

            <!-- 无评论 -->
            <div v-if="commentData.list.length === 0 && !commentData.loading" class="no-comments">
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