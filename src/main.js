
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// pinia持久化插件
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { useUserStore } from './stores/user'

import App from './App.vue'
import router from './router'
// 引入全局样式，
import '@/styles/Common.scss'
//全局引入ElIcons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 创建一个 Vue 应用实例，App 是根组件（通常是 App.vue）
// 一个 Vue 应用实例（app）是 Vue 3 中通过 createApp() 创建的一个对象，它代表整个 Vue 应用程序的“核心容器”。
// 以App.vue为根进行渲染、挂载各项功能等
// 1. app 并不只是代表 App.vue
// 虽然 app 是通过 createApp(App) 创建的，其中的 App 是 App.vue 根组件，但 app 这个实例其实还包含了更多内容：

// 整个组件树（从 App.vue 开始）
// 插件（如 Pinia、Vue Router）
// 全局注册的组件、指令
// 应用配置
// 所以你可以认为它是整个 Vue 应用的“大脑”。
const app = createApp(App)
// 持久化的pinia实例
app.use(createPinia().use(createPersistedState()))
//注意写的位置，要在创建pinia实例之后，否则会报错
const userStore = useUserStore()
if(userStore.isTokenExpired()) {
  userStore.isLogin = true
}
app.use(router)

app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}