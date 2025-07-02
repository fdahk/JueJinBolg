import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 配置顶级 await 插件
import topLevelAwait from 'vite-plugin-top-level-await';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    topLevelAwait()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    //CSS 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData:  `@import "@/styles/var.scss";` //每个 SCSS 文件编译前自动注入的代码，全局引入变量
      }
    }
  }
})
