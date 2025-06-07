<script setup>
import { ref, defineProps } from 'vue';
import leftNav from './components/leftNav.vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
</script>
<template>
  <div class="sescondViewBox">
    <leftNav />
    <RouterView />   
  </div>

</template>
<style scoped lang="scss">
  .sescondViewBox {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    padding-top: 20px;
  }
</style>