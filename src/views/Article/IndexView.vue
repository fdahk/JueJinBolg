<script setup>
 import ArticleDetail from './components/ArticleDetail.vue'
 import ArticleAuthor from './components/ArticleAuthor.vue'
 import ArticleInteract from './components/ArticleInteract.vue'
 import ArticleComment from './components/ArticleComment.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const articleInfo = ref({})

const shareArticleInfo = (articleInfo) => {
    articleInfo.value = articleInfo
}

// 侧边评论功能
const showSideComment = ref(false)
const inputComment = (value) => {
    showSideComment.value = value
}
// 关闭侧边评论
const sideCommentRef = ref() // 绑定下侧边评论区
// const articleInteractRef = ref() // 绑定交互按钮，用css类绑定更方便

const closeSideComment = (e) => {
    // 侧边栏没有打开，不处理
    if (!showSideComment.value) return
    
    const target = e.target

    // 侧边栏元素不存在，关闭
    if (!sideCommentRef.value) {
        showSideComment.value = false
        return
    }    
    
    // 侧边栏内部元素，不关闭
    // 给vue组件套个css类，方便绑定
    if (sideCommentRef.value.contains(target)) {
        return
    }
    
    // 交互按钮，不关闭
    if (target.closest('.articleInteractContainer')) {
        return
    }
    
    // 其他情况都关闭侧边栏
    showSideComment.value = false
    console.log('closeSideComment', showSideComment.value)
}
onMounted(() => {
    document.addEventListener('click', closeSideComment)
})  
onUnmounted(() => {
    document.removeEventListener('click', closeSideComment)
})
</script>

<template>
    <div class="secondViewBox">
        <div class="articleInteractContainer">
            <ArticleInteract ref="articleInteractRef" :showSideComment="showSideComment" @inputComment="inputComment" />
        </div>

        <div class="secondViewBoxBody">
            <ArticleDetail @shareArticleInfo="shareArticleInfo" />
            <ArticleComment :articleId="route.params.id" :articleInfo="articleInfo" />            
        </div>

        <div class="secondViewBoxRightContainer">
            <ArticleAuthor />
        </div>

        <div class="sideCommentContainer" v-show="showSideComment" ref="sideCommentRef"> 
            <ArticleComment :articleId="route.params.id" :articleInfo="articleInfo" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.secondViewBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
.secondViewBoxBody {
    display: flex;
    flex-direction: column;
    width: 70%;
}
.secondViewBoxRightContainer {
    flex: 1;
    height: 50vh;
    margin-left: 20px;
}

// 侧边评论
.sideCommentContainer {
    position: fixed;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    background-color: #fff;
    overflow: scroll; // 组件内滚动
    scrollbar-width: none;
    z-index: 2000;
}
</style>