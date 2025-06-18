<script setup>
 import ArticleDetail from './components/articleDetail.vue'
 import ArticleAuthor from './components/ArticleAuthor.vue'
 import ArticleInteract from './components/ArticleInteract.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from '@/utils/toast.js'

const route = useRoute()


</script>

<template>
    <div class="secondViewBox">
        <ArticleInteract />

        <ArticleDetail />
        
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

.secondViewBoxRightContainer {
    flex: 1;
    height: 50vh;
    margin-left: 20px;
}
</style>