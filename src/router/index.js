import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/IndexView.vue'
import CourseView from '@/views/CourseView/IndexView.vue'
import HomeView from '@/views/Home/IndexView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: Layout,
      children: [
        {
          path : '',
          component : HomeView
        },
        {
          path : '/course',
          component : CourseView
        }
      ]
    },

  ],
})

export default router
