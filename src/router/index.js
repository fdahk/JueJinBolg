import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/IndexView.vue'
import CourseView from '@/views/CourseView/IndexView.vue'
import HomeView from '@/views/Home/IndexView.vue'
import settingView from '@/views/Setting/IndexView.vue'
import profileSetting from '@/views/Setting/components/profileSetting.vue'
import accountSetting from '@/views/Setting/components/accountSetting.vue'
// 首页文章组件
import homeArticle from '@/views/Home/components/HomeArticle.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: Layout,
      // children 是一个数组，用于定义当前路由的子路由。固定写法，不能写错
      // 当要渲染子路由时，即使父路由没有出口，也会自动渲染父路由
      // App.vue是根组件，默认在那渲染
      children: [
        // 首页二级路由
        {
          // 二级路由实现部分页面切换的原理基于Vue Router的嵌套路由机制
          // 当访问根路径时，会渲染Layout组件，Layout组件中包含了一个router-view，
          // 这个router-view会根据当前路由的路径来渲染对应的子组件。
          path : '',
          component : HomeView,
          redirect: '/comprehensive', // 重定向，默认跳转到综合分类
          children: [
              // 三级路由，文章分类
                {
                  path: 'follow',
                  name: 'Follow',
                  component: homeArticle
                },
                {
                  path: 'comprehensive',
                  name: 'Comprehensive',
                  component: homeArticle
                },
                {
                  path: 'backend',
                  name: 'Backend',
                  component: homeArticle
                },
                {
                  path: 'frontend',
                  name: 'Frontend',
                  component: homeArticle
                },
                {
                  path: 'android',
                  name: 'Android',
                  component: homeArticle
                },
                {
                  path: 'ios',
                  name: 'iOS',
                  component: homeArticle
                },
                {
                  path: 'ai',
                  name: 'AI',
                  component: homeArticle
                },
                {
                  path: 'tools',
                  name: 'Tools',
                  component: homeArticle
                },
                {
                  path: 'career',
                  name: 'Career',
                  component: homeArticle
                },
                {
                  path: 'reading',
                  name: 'Reading',
                  component: homeArticle
                },
                {
                  path: 'ranking',
                  name: 'Ranking',
                  component: homeArticle
                }
          ]
        },
        // 课程二级路由
        {
          path : 'course',
          component : CourseView
        },
        // 设置二级路由
        {
          path : 'setting',
          component: settingView,
          children: [
            {
              // 设置为‘/’会很诡异
              path: '',
              component: profileSetting
            },
            {
              //子路由路径如果以 / 开头，会被视为 绝对路径 （即根路径）
              path: 'account',
              component: accountSetting
            }

          ]
        }
      ]
    },

  ],
  // linkActiveClass: 'active', // 包含匹配时的类名（可选）
  linkExactActiveClass: 'active' // 精确匹配时的类名（关键）
})

export default router
