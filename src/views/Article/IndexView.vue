<script setup>
 import ArticleDetail from './components/ArticleDetail.vue'
 import ArticleAuthor from './components/ArticleAuthor.vue'
 import ArticleInteract from './components/ArticleInteract.vue'
 import ArticleComment from './components/ArticleComment.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from '@/utils/toast.js'

const route = useRoute()


</script>

<template>
    <div class="secondViewBox">
        <ArticleInteract />

        <div class="secondViewBoxBody">
            <ArticleDetail />
            <ArticleComment :articleId="route.params.id" />            
        </div>

        <div class="secondViewBoxRightContainer">
            <ArticleAuthor />
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
</style>