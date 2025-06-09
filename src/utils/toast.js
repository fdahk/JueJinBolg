/**
 * - 使用 Toast.vue 组件进行渲染
 * - 通过 Vue 的 createApp API 动态创建组件实例
 * - 配合浏览器 DOM API 管理元素生命周期
 * - ES6 class 语法定义类
 * - 动态导入路径使用 @ 别名
 */

// 导入 Vue 3 的 createApp API，用于动态创建 Vue 应用实例
import { createApp } from 'vue'
import Toast from '@/components/common/Toast.vue'

/**
 * Toast 通知管理器类
 * 
 * 语法解释：
 * - class 关键字定义类
 * - constructor 构造函数初始化实例
 * - this 关键字引用当前实例
 * - 数组用于存储通知实例列表
 * 
 * 功能解释：
 * - 管理所有活跃的通知实例
 * - 限制同时显示的通知数量
 * - 提供统一的通知操作接口
 * 
 * 与其他代码协作：
 * - 实例方法被全局导出的函数调用
 * - 管理 Toast 组件的生命周期
 * - 与 DOM API 配合处理元素操作
 */
class ToastManager {
    // 构造函数
  constructor() {
    this.toasts = []
    this.maxToasts = 5 // 最多同时显示5个通知
  }

  /**
   * @param {string} message 消息内容
   * @param {string} type 通知类型 success|error|warning|info
   * @param {number} duration 持续时间，毫秒
   */
  show(message, type = 'info', duration = 1000) {
    // 如果超过最大数量，移除最早的通知
    if (this.toasts.length >= this.maxToasts) {
      this.remove(this.toasts[0])
    }

    // 创建容器
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 创建Vue应用实例，传入Toast组件和props参数
    const app = createApp(Toast, {
      message,
      type,
      duration,
      onClose: () => {
        this.remove({ app, container })
      }
    })

    // 挂载组件
    app.mount(container)

    // 添加到管理列表
    const toastInstance = { app, container }
    this.toasts.push(toastInstance)

    return toastInstance
  }

  /**
   * 移除通知，卸载组件并移除DOM
   * @param {Object} toastInstance 通知实例
   */
  remove(toastInstance) {
    const index = this.toasts.indexOf(toastInstance)
    if (index > -1) {
      this.toasts.splice(index, 1)
      
      // 卸载组件并移除DOM
      if (toastInstance.app) {
        toastInstance.app.unmount()
      }
      //传统写法：安全的 DOM 元素移除操作，使用了防御性编程思想
      if (toastInstance.container && toastInstance.container.parentNode) {
        toastInstance.container.parentNode.removeChild(toastInstance.container)
      }
    // if (element) {
    //     element.remove() // 更简洁，但兼容性稍差
    //   }
    }
  }

  /**
   * 清除所有通知
   */
  clear() {
    this.toasts.forEach(toast => {
      this.remove(toast)
    })
    this.toasts = []
  }

  /**
   * 成功通知
   * @param {string} message 消息内容
   * @param {number} duration 持续时间
   */
  success(message, duration = 1000) {
    return this.show(message, 'success', duration)
  }


  error(message, duration = 1000) {
    return this.show(message, 'error', duration)
  }


  warning(message, duration = 1000) {
    return this.show(message, 'warning', duration)
  }


  info(message, duration = 1000) {
    return this.show(message, 'info', duration)
  }
}

// 实现类，创建全局实例
const toast = new ToastManager()

// 便捷方法
export const showToast = (message, type = 'info', duration = 1000) => {
  return toast.show(message, type, duration)
}

export const showSuccess = (message, duration = 1000) => {
  return toast.success(message, duration)
}

export const showError = (message, duration = 1000) => {
  return toast.error(message, duration)
}

export const showWarning = (message, duration = 1000) => {
  return toast.warning(message, duration)
}

export const showInfo = (message, duration = 1000) => {
  return toast.info(message, duration)
}

export default toast 