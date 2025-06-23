<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/apis/article.js'
import { userArticleApi } from '@/apis/userArticle.js'
import { useUserStore } from '@/stores/user.js'

const route = useRoute()
const userStore = useUserStore()
const emits = defineEmits(['inputComment'])
const props = defineProps({
    showSideComment: {
        type: Boolean,
        default: false
    }
})
// 侧边评论区 
const inputComment = () => {
    emits('inputComment', !props.showSideComment) 
}
// 文章ID
const articleId = ref(null)

// 按钮配置和状态
const iconList = ref([
    {
        icon: 'icon-like-fill',
        label: '点赞',
        action: 'like',
        count: 0,
        isActive: false,
        activeColor: '#1e80ff'
    },
    {
        icon: 'icon-message-fill',
        label: '评论',
        action: 'comment',
        count: 0,
        isActive: false,
        activeColor: '#1e80ff'
    },
    {
        icon: 'icon-star-fill',
        label: '收藏',
        action: 'favorite',
        count: 0,
        isActive: false,
        activeColor: '#1e80ff'
    },
    // {
    //     icon: 'icon-file-copy-fill',
    //     label: '复制',
    //     action: 'copy',
    //     count: 0,
    //     isActive: false,
    //     activeColor: '#1e80ff'
    // },
    {
        icon: 'icon-error',
        label: '举报',
        action: 'report',
        count: 0,
        isActive: false,
        activeColor: '#1e80ff'
    },
    {
        icon: 'icon-link',
        label: '分享',
        action: 'share',
        count: 0,
        isActive: false,
        activeColor: '#1e80ff'
    }
])

// 获取用户信息
const getUserPhone = () => {
    // console.log(userStore.userPhone)
    return userStore?.userPhone || 'test_user'
}

// 按钮点击处理函数
const handleIconClick = async (item) => {
    if (!articleId.value) {
        console.log('文章信息获取中，请稍后再试')
        return
    }

    switch (item.action) {
        case 'like':
            await handleLike(item)
            break
        case 'comment':
            handleComment(item)
            break
        case 'favorite':
            await handleFavorite(item)
            break
        case 'copy':
            await handleCopy(item)
            break
        case 'report':
            handleReport(item)
            break
        case 'share':
            handleShare(item)
            break
        default:
            console.log('未知操作:', item.action)
    }
}

// 点赞功能 - 传递用户信息
const handleLike = async (item) => {
    try {
        const userPhone = getUserPhone()
        const response = await userArticleApi.toggleLike(
            articleId.value,
            item.isActive ? 'unlike' : 'like',
            userPhone
        )

        if (response.data.code === 200) {
            item.isActive = !item.isActive
            item.count = response.data.data.likeCount
            
            console.log(item.isActive ? '点赞成功！' : '取消点赞')
        } else {
            console.log(response.data.message || '操作失败')
        }
    } catch (error) {
        console.log('网络错误，请重试')
        console.error('点赞失败:', error)
    }
}

// 侧边评论功能
const handleComment = (item) => {
    inputComment()
}

// 收藏功能 
const handleFavorite = async (item) => {
    try {
        const userPhone = getUserPhone()
        const response = await userArticleApi.toggleFavorite(
            articleId.value,
            item.isActive ? 'unfavorite' : 'favorite',
            userPhone
        )

        if (response.data.code === 200) {
            item.isActive = !item.isActive
            item.count = response.data.data.collectCount
            console.log(item.isActive ? '收藏成功！' : '取消收藏')
        } else {
            console.log(response.data.message || '操作失败')
        }
    } catch (error) {
        console.log('网络错误，请重试')
        console.error('收藏失败:', error)
    }
}


// 举报功能 -- 没写
const handleReport = (item) => {
    const reason = prompt('请输入举报原因:') // JS内置浏览器API，显示一个包含输入框的对话框，获取用户输入。
    if (reason && reason.trim()) {
        // API 举报
    }
}

// 分享功能 -- 不完善
const handleShare = (item) => {
    if (navigator.share) {
        // 支持 Web Share API 的浏览器
        navigator.share({
            title: document.title,
            url: window.location.href
        }).then(() => {
            console.log('分享成功')
        }).catch(err => {
            console.log('分享取消或失败:', err)
        })
    } else {
        // 不支持的浏览器
        console.log('分享失败')
    }
}

// 加载用户交互状态 
const loadUserInteractions = async () => {
    try {
        const userPhone = getUserPhone()
        const response = await userArticleApi.getInteraction(articleId.value, userPhone)
        
        if (response.data.code === 200) {
            const data = response.data.data
            // console.log('data', data) // 测试
            // 更新按钮状态
            iconList.value[0].isActive = data.isLike      // 点赞状态
            iconList.value[0].count = data.likeCount       // 点赞数量
            iconList.value[1].count = data.commentCount    // 评论数量
            iconList.value[2].isActive = data.isCollect  // 收藏状态
            iconList.value[2].count = data.collectCount  // 收藏数量
        }
    } catch (error) {
        console.error('加载交互状态失败:', error)
    }
}

// 初始化数据
const initializeData = async () => {
    // 从路由参数获取文章ID
    articleId.value = route.params.id
    
    // 加载用户交互状态
    await loadUserInteractions()
}

onMounted(() => {
    initializeData()
})
</script>

<template>
    <div class="secondViewBoxLeft">
    <div 
        v-for="item in iconList" 
        :key="item.icon" 
        class="iconItemBox"
        :class="{ active: item.isActive }"
        :style="{ color: item.isActive ? item.activeColor : '' }"
        @click="handleIconClick(item)"
        :title="item.label" 
    >
        <i class="iconfont" :class="item.icon"></i>
        <div v-if="item.count > 0" class="count" :class="{ active: item.isActive }">{{ item.count }}</div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.secondViewBoxLeft {
    width: 60px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: fixed;
    left: 150px;
    top: 20%;
    z-index: 100;

    .iconItemBox {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        color: #666;
        position: relative;
        padding: 8px 4px;
        
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
            color: #333;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
        }
        
        &.active {
            color: #1e80ff;
            background: linear-gradient(145deg, #ffffff, #f8f8f8);
            // border: 1px solid #1e80ff;
            
            .iconfont {
                // 动画效果
                animation: bounce 0.6s ease;
            }
        }
        
        .iconfont {
            font-size: 1.4rem;
            margin-bottom: 4px;
        }
        
        .count {
            display: flex;
            background-color: #807c7c;
            padding: 3px;
            border-radius: 40%;
            font-size: 10px;
            font-weight: 600;
            color: white;
            line-height: 1;
            position: absolute;
            top: -5px;
            right: -5px;
            &.active {
                background-color: #1e80ff;
            }
        }
        
    }    
}


// 动画效果
// 关键帧定义
@keyframes bounce {
    //时间轴：0% 20% 60% 100%
    0%, 20%, 60%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    80% {
        transform: translateY(-5px);
    }
}

// 响应式设计
@media (max-width: 1200px) {
    .secondViewBoxLeft {
        left: 20px;
    }
}

@media (max-width: 768px) {
    .secondViewBoxLeft {
        position: relative;
        width: 100%;
        flex-direction: row;
        left: 0;
        top: 0;
        justify-content: center;
        margin-bottom: 20px;
        
        .iconItemBox {
            width: 45px;
            height: 60px;
        }
    }
}
</style>