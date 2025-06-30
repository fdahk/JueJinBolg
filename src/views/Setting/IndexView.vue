<script setup>
import { ref, defineProps } from 'vue';
import leftNav from './components/leftNav.vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
</script>
<template>
  <div class="setting-container">
    <leftNav />
    <RouterView />   
  </div>

</template>
<style scoped lang="scss">
  .setting-container {
    display: flex;
    width: 100%;
    min-height: 70%;
    height: 45rem;
    position: relative;
    padding-top: 20px;
  }
</style>