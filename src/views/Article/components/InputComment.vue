<script setup>
import { ref, reactive, computed, defineProps, defineEmits, defineExpose, onMounted, onUnmounted } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import { userArticleApi } from '@/apis/userArticle'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const props = defineProps({
    articleId: {
        type: String,
        required: true
    }
})
const emits = defineEmits(['updateComment'])

// 评论内容
const commentForm = reactive({
  content: '',
  maxLength: 1000
})

// 表情面板显示状态
const showEmojiPanel = ref(false)

// 表情数据
const allEmojis = ref([
    { symbol: '😀', name: '开心' },
    { symbol: '😃', name: '高兴' },
    { symbol: '😄', name: '大笑' },
    { symbol: '😁', name: '咧嘴笑' },
    { symbol: '😆', name: '眯眼笑' },
    { symbol: '😅', name: '苦笑' },
    { symbol: '🤣', name: '笑哭' },
    { symbol: '😂', name: '喜极而泣' },
    { symbol: '🙂', name: '微笑' },
    { symbol: '🙃', name: '倒脸' },
    { symbol: '😉', name: '眨眼' },
    { symbol: '😊', name: '害羞' },
    { symbol: '😇', name: '天使' },
    { symbol: '🥰', name: '爱心脸' },
    { symbol: '😍', name: '花痴' },
    { symbol: '🤩', name: '星星眼' },
    { symbol: '😘', name: '飞吻' },
    { symbol: '😗', name: '亲吻' },
    { symbol: '😙', name: '眯眼亲吻' },
    { symbol: '😚', name: '闭眼亲吻' },
    { symbol: '😋', name: '美味' },
    { symbol: '😛', name: '吐舌' },
    { symbol: '😜', name: '眨眼吐舌' },
    { symbol: '🤪', name: '疯狂脸' },
    { symbol: '😝', name: '闭眼吐舌' },
    { symbol: '🤑', name: '财迷' },
    { symbol: '🤗', name: '拥抱' },
    { symbol: '🤭', name: '捂嘴笑' },
    { symbol: '🤫', name: '嘘' },
    { symbol: '🤔', name: '思考' },
    { symbol: '🤐', name: '封嘴' },
    { symbol: '🤨', name: '质疑' },
    { symbol: '😐', name: '面无表情' },
    { symbol: '😑', name: '无语' },
    { symbol: '😶', name: '没嘴脸' },
    { symbol: '😏', name: '得意' },
    { symbol: '😒', name: '不高兴' },
    { symbol: '🙄', name: '翻白眼' },
    { symbol: '😬', name: '尴尬' },
    { symbol: '🤥', name: '说谎' },
    { symbol: '😌', name: '安心' },
    { symbol: '😔', name: '沮丧' },
    { symbol: '😪', name: '困' },
    { symbol: '🤤', name: '流口水' },
    { symbol: '😴', name: '睡觉' },
    { symbol: '😷', name: '口罩' },
    { symbol: '🤒', name: '发烧' },
    { symbol: '🤕', name: '受伤' },
    { symbol: '🤢', name: '恶心' },
    { symbol: '🤮', name: '呕吐' },
    { symbol: '🤧', name: '打喷嚏' },
    { symbol: '🥵', name: '热脸' },
    { symbol: '🥶', name: '冷脸' },
    { symbol: '🥴', name: '晕' },
    { symbol: '😵', name: '昏' },
    { symbol: '🤯', name: '爆炸头' },
    { symbol: '🤠', name: '牛仔' },
    { symbol: '🥳', name: '庆祝' },
    { symbol: '😎', name: '墨镜' },
    { symbol: '🤓', name: '书呆子' },
    { symbol: '🧐', name: '单片眼镜' },
    { symbol: '😕', name: '困惑' },
    { symbol: '😟', name: '担心' },
    { symbol: '🙁', name: '皱眉' },
    { symbol: '☹️', name: '不开心' },
    { symbol: '😮', name: '惊讶' },
    { symbol: '😯', name: '震惊' },
    { symbol: '😲', name: '吃惊' },
    { symbol: '😳', name: '脸红' },
    { symbol: '🥺', name: '恳求' },
    { symbol: '😦', name: '皱眉张嘴' },
    { symbol: '😧', name: '痛苦' },
    { symbol: '😨', name: '害怕' },
    { symbol: '😰', name: '焦虑' },
    { symbol: '😥', name: '失望' },
    { symbol: '😢', name: '哭泣' },
    { symbol: '😭', name: '大哭' },
    { symbol: '😱', name: '尖叫' },
    { symbol: '😖', name: '纠结' },
    { symbol: '😣', name: '坚持' },
    { symbol: '😞', name: '失望' },
    { symbol: '😓', name: '汗' },
    { symbol: '😩', name: '疲惫' },
    { symbol: '😫', name: '疲倦' },
    { symbol: '😤', name: '生气' },
    { symbol: '😡', name: '愤怒' },
    { symbol: '😠', name: '生气' },
    { symbol: '🤬', name: '脏话' },
    { symbol: '👍', name: '点赞' },
    { symbol: '👎', name: '踩' },
    { symbol: '👌', name: 'OK' },
    { symbol: '✌️', name: '胜利' },
    { symbol: '🤞', name: '祈祷' },
    { symbol: '🤟', name: '爱你' },
    { symbol: '🤘', name: '摇滚' },
    { symbol: '👏', name: '鼓掌' },
    { symbol: '🙌', name: '万岁' },
    { symbol: '👐', name: '张开双手' },
    { symbol: '🤲', name: '双手捧' },
    { symbol: '🙏', name: '合十' },
    { symbol: '✍️', name: '写字' },
    { symbol: '💪', name: '肌肉' },
    { symbol: '❤️', name: '红心' },
    { symbol: '🧡', name: '橙心' },
    { symbol: '💛', name: '黄心' },
    { symbol: '💚', name: '绿心' },
    { symbol: '💙', name: '蓝心' },
    { symbol: '💜', name: '紫心' },
    { symbol: '🖤', name: '黑心' },
    { symbol: '🤍', name: '白心' },
    { symbol: '🤎', name: '棕心' },
    { symbol: '💔', name: '心碎' },
    { symbol: '❣️', name: '心叹号' },
    { symbol: '💕', name: '两颗心' },
    { symbol: '💞', name: '旋转心' },
    { symbol: '💓', name: '心跳' },
    { symbol: '💗', name: '心长大' },
    { symbol: '💖', name: '闪亮心' },
    { symbol: '💘', name: '丘比特箭' },
    { symbol: '💝', name: '心形礼物' }
])

// 字数统计
const wordCount = computed(() => {
  return commentForm.content.length
})

// 表情面板ref
const emojiPanelRef = ref(null)
const emojiBtnRef = ref(null)

// 切换表情面板
const toggleEmojiPanel = () => {
    showEmojiPanel.value = !showEmojiPanel.value
}

// 插入表情
const insertEmoji = (emoji) => {
    //获取用户光标
    const textarea = textareaRef.value
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    
    // 插入表情
    const beforeText = commentForm.content.substring(0, startPos)
    const afterText = commentForm.content.substring(endPos)
    commentForm.content = beforeText + emoji.symbol + afterText
    
    // 更新索引
    setTimeout(() => {
        const newPos = startPos + emoji.symbol.length
        textarea.setSelectionRange(newPos, newPos)
        textarea.focus()
        // 调整textarea高度
        resizeTextarea(textarea)
    }, 0)
    
    // 关闭面板
    showEmojiPanel.value = false
}

// 点击外部关闭表情面板
const handleClickOutside = (event) => {
    // 错误写法
    // const emojiPanel = document.querySelector('.emoji-panel') //不能文档查询，有多个相同组件
    // const emojiBtn = document.querySelector('.emoji-btn')
    // const emojiPanel = emojiPanelRef.value.querySelector('.emoji-panel')
    // const emojiBtn = emojiPanelRef.value.querySelector('.emoji-btn')
    // if (emojiPanel && !emojiPanel.contains(event.target) && !emojiBtn.contains(event.target)) {
    //     console.log("1")
    //     showEmojiPanel.value = false
    // }

    // 直接使用 ref 的值
    const emojiPanel = emojiPanelRef.value
    const emojiBtn = emojiBtnRef.value
    if (emojiPanel && emojiBtn) {
        if (!emojiPanel.contains(event.target) && !emojiBtn.contains(event.target)) {
            showEmojiPanel.value = false
        }
    }
}


// 发送评论
const submitComment = async () => {
    try {
        // console.log(props.articleId)
        const res = await userArticleApi.publishComment(props.articleId, 
            {
                content: commentForm.content,
                userPhone: userStore.userPhone,
                userName: userStore.userName,
                userPic: userStore.userPic,
                parentId: null,
                level: 1
            }
        )
        if (res.data.code === 200) {
            showSuccess('评论发表成功')
            commentForm.content = ''
            setTimeout(() => {
                resizeTextarea(document.querySelector('.input-content-textarea'))
            }, 0)
            // console.log(res.data.userComment[0]) // 注意要加索引
            // 直接插入用户的评论，实现评论的实时更新
            emits('updateComment', res.data.userComment[0])
        }        
    } catch(error) {
        console.error('发送评论失败:', error)
    }

}

// 输入框大小调整
const resizeTextarea = (textarea) => {
    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight 
    const maxHeight = 200
    const minHeight = 110
    const newHeight = Math.min( Math.max(scrollHeight, minHeight), maxHeight)
    textarea.style.height = newHeight + 'px' 
    // 如果输入内容高度超过最大高度，则滚动条出现
    if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto'
    } else {
        textarea.style.overflowY = 'hidden'
    }
}

// 处理输入内容变化，调整输入框高度
const handleTextareaInput = (event) => {
    resizeTextarea(event.target)
}

// 键盘发送评论
const handleTextareaKeydown = (event) => {
  // Ctrl + Enter 发送评论
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault() // 阻止默认换行行为
    // 有内容可以发送
    if (commentForm.content.trim()) {
      submitComment()
    }
  }
}

// 标记输入框ref
const textareaRef = ref(null)
// 暴露方法
const focus = () => {
    textareaRef.value.focus()
}
defineExpose({
    focus,
    commentForm
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside) //不会重复,父级v-if会销毁，最多同时存在一个
})

onUnmounted(() => {
    console.log("销毁了回复框事件监听")
    document.removeEventListener('click', handleClickOutside) 
})
</script>
<template>
<div class="comment-input-box">

    <!-- 评论输入框 -->
    <div class="input-content-container" >
        <!-- 评论输入 -->
        <textarea
            ref="textareaRef"
            v-model="commentForm.content"
            :maxlength="commentForm.maxLength"
            placeholder="平等表达，友善交流"
            class="input-content-textarea"
            @keydown="handleTextareaKeydown"
            @input="handleTextareaInput"
        ></textarea>
            
        <!-- 评论输入框底部 -->
        <div class="input-footer" @mousedown.prevent>
            <div class="other-btn">
                <button 
                    ref="emojiBtnRef"
                    class="emoji-btn" 
                    :class="{ active: showEmojiPanel }"
                    title="表情" 
                    @click="toggleEmojiPanel" 
                    @mousedown.prevent
                >
                    <i class="iconfont icon-smile-fill"></i>
                </button>
                <button class="image-btn" title="图片" @mousedown.prevent>
                    <i class="iconfont icon-image-fill"></i>
                </button>
            </div>
            <!-- 发送评论按钮 -->
            <div class="send-comment-container" @mousedown.prevent>
            <span class="word-count">{{ wordCount }} / {{ commentForm.maxLength }}</span>
            <button 
                class="send-comment"
                :disabled="!commentForm.content.trim()"
                @mousedown.prevent
                @click="submitComment"
            > 发送 </button>
            </div>
            <!-- 表情面板 -->
            <div ref="emojiPanelRef" class="emoji-panel" v-if="showEmojiPanel" >
            <div class="emoji-grid-container">
                <div class="emoji-grid">
                    <div 
                        v-for="emoji in allEmojis" 
                        :key="emoji.symbol"
                        class="emoji-item"
                        @click="insertEmoji(emoji)"
                        :title="emoji.name"
                    >
                        {{ emoji.symbol }}
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</div>    
</template>
<style scoped lang="scss">
// 评论输入框
.comment-input-box {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    gap: 12px;
}

// 评论输入文本区
.input-content-container {
    position: relative;  // 新增：为表情面板提供定位基准
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
        // display: flex; // 与min-height冲突
        width: 100%;
        // min-height: 50px; 
        // max-height: 200px;
        // height: auto;
        min-height: var(--min-height, 50px);
        max-height: var(--max-height, 200px);
        padding: 12px;
        background-color: transparent;        
        resize: none; // 大小不可手动调整
        border: none;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 1.3;
        outline: none; // 去除默认的聚焦边框
        transition:  .4s;
        &:focus {
            // min-height: 110px; 
            min-height: var(--min-height, 110px);
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
            // 评论输入框其他按钮
            button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0 5px;
                // 按钮
                .emoji-btn, .image-btn {
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                // 按钮悬停
                .emoji-btn:hover, .image-btn:hover {
                    background-color: #f0f0f0;
                } 
                // 字体图标               
                .iconfont {
                    font-size: 1.3rem;
                    color: rgba(128, 128, 128, 0.7);
                    outline: none;
                    &:hover {
                        color: $primaryColor;
                    }
                }            
            }

        }    
    }

    // 发送评论按钮
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

// 表情面板
.emoji-panel {
    position: absolute;
    top: 100%; // 相对于定位元素顶部距离其100%
    left: 0;
    right: 20%;
    background: white;
    border: 1px solid #e4e6ea;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    height: 280px;
    margin-bottom: 8px;
    animation: slideUp 0.2s ease-out;
    
    // 表情网格容器
    .emoji-grid-container {
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        
        // 自定义滚动条
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-track {
            background: #f7f8fa;
            border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
            background: #c9cdd4;
            border-radius: 3px;
            
            &:hover {
                background: #a5abb6;
            }
        }
    }
    
    // 表情网格
    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 0;
        
        .emoji-item {
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            
            &:hover {
                background: #f2f3f5;
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            &:active {
                background: #e4e6ea;
                transform: scale(0.95);
            }
        }
    }
}

// 表情面板进入动画
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 表情按钮激活状态
.emoji-btn {
    position: relative;
    
    &.active {
        .iconfont {
            color: $primaryColor !important; //必须加important
        }
        
        // 激活下划线
        // &::after {
        //     content: '';
        //     position: absolute;
        //     bottom: -2px;
        //     left: 50%;
        //     transform: translateX(-50%);
        //     width: 20px;
        //     height: 2px;
        //     background: $primaryColor;
        //     border-radius: 1px;
        // }
    }
}



// 响应式适配
@media (max-width: 768px) {
    .emoji-panel {
        height: 240px;
        
        .emoji-grid-container {
            padding: 16px;
        }
        
        .emoji-grid {
            grid-template-columns: repeat(7, 1fr);
            gap: 6px;
            
            .emoji-item {
                width: 28px;
                height: 28px;
                font-size: 18px;
            }
        }
    }
}
</style>