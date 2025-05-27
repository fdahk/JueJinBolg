import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/IndexView.vue'
import CourseView from '@/views/CourseView/IndexView.vue'
// import HomeNav  from '@/views/Home/components/HomeNav.vue'
import HomeArticle from '@/views/Home/components/HomeArticle.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: Layout,
      children: [
        {
          path : '',
          component : HomeArticle
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
