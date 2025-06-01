<script setup>
import TopNav from '@/views/Nav/TopNav.vue';
import BottomAdvt from '@/views/Advt/BottomAdvt.vue';
import loginView from '@/views/Login/indexView.vue';
</script>

<template>
  <TopNav />
  <BottomAdvt />
  <loginView />
  <Router-view/>
</template>
