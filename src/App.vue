<script setup>

</script>

<template>
    <!-- 在 Vue 应用中， App.vue 是整个应用的根组件（由 main.js 中 createApp(App).mount('#app') 挂载到页面的 #app 容器）。
    根组件中的 <RouterView> 是整个路由系统的最外层出口，负责渲染顶层路由匹配的组件，因此被称为“根路由出口”。 -->
    <!-- 一级路由出口 -->
    <RouterView />
</template>

<style scoped>

</style>
