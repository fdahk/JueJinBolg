
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// pinia持久化插件
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { useUserStore } from './stores/user'

import App from './App.vue'
import router from './router'
// 引入全局样式，
import '@/styles/Common.scss'
// 引入elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入El-Icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入阿里字体图标样式，比elementPlus好用
import '@/assets/iconFonts/iconfont.css'
// 引入 Markdown 配置（执行配置
import '@/utils/markdown.js'

// 创建一个 Vue 应用实例，App 是根组件（通常是 App.vue）
// createApp 函数用于创建一个新的 Vue 应用实例，它接收一个根组件作为参数
// 以App.vue为根进行渲染、挂载各项功能等
// 这个实例是整个 Vue 应用程序的“核心容器”，代表了整个应用，负责管理组件树、插件、全局注册的组件和指令以及应用配置等
// 1. app 并不只是代表 App.vue
// 虽然 app 是通过 createApp(App) 创建的，其中的 App 是 App.vue 根组件，但 app 这个实例其实还包含了更多内容
// 整个组件树（从 App.vue 开始）
// 插件（如 Pinia、Vue Router）
// 全局注册的组件、指令
// 应用配置
// 所以你可以认为它是整个 Vue 应用的“大脑”。
// 2.
// 通过 app.mount('#app') 方法将 Vue 应用实例 app 挂载到这个 DOM 元素上。
// 挂载之后， App.vue 组件的内容就会渲染到 #app 元素所在的位置。
const app = createApp(App) // 
// 持久化的pinia实例
app.use(createPinia().use(createPersistedState()))
//注意写的位置，要在创建pinia实例之后，否则会报错
const userStore = useUserStore()
if(userStore.isTokenExpired()) {
  userStore.isLogin = true
}
app.use(router)
app.use(ElementPlus)

// eleP图标注册的 for 循环,注意在app挂载前使用，确保所有的插件、组件注册都在应用挂载之前完成
//确保安装 npm install element-plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
