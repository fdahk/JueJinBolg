import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import CourseView from '@/views/CourseView/IndexView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      component: HomeView,
      children: [
        {
          path : '',
          component : HomeView
        },
        {
          path : '/course',
          name : 'course',
          component : CourseView
        }
      ]
    },

  ],
})

export default router
