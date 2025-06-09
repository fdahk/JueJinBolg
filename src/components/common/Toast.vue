<!-- 
  - <script setup> Vue 3 Composition API 语法糖
  - 接收来自 toast.js 管理器的参数
  - 通过回调函数通知父级组件状态变化
-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 定义组件属性
 * - validator 函数用于自定义属性值验证
 * - Array.includes() 检查值是否在允许的范围内

 * - message: 必需的字符串，显示的通知内容
 * - type: 通知类型，默认为 'info'，限制为四种预定义类型
 * - duration: 显示持续时间，默认 3000 毫秒（3秒）
 * - onClose: 关闭时的回调函数，默认为空函数
 * - 被 toast 管理器传入参数
 * - 影响模板中的条件渲染和样式
 */
const props = defineProps({
  message: {
    type: String,              // 消息文本类型为字符串
    required: true            // 必填属性
  },
  type: {
    type: String,              // 通知类型为字符串
    default: 'info',          // 默认值为 'info'
    // 自定义验证器，确保类型值在预定义范围内
    // value 是传入的类型值
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,              // 持续时间为数字类型
    default: 3000             // 默认 3000 毫秒
  },
  onClose: {
    type: Function,            // 关闭回调为函数类型
    default: () => {}         // 默认空函数
  }
})

/**
 * - visible 与模板中的 v-if 指令绑定
 */
const visible = ref(false)    // 初始为隐藏状态
let timer = null             // 定时器引用，初始为 null

/**
 * - 显示通知（设置 visible 为 true）
 * - 设置自动隐藏定时器（如果 duration > 0）
 * - 在动画完成后执行关闭回调
 * 
 * - 触发模板的条件渲染显示通知
 * - 启动 CSS 过渡动画
 * - 通知管理器处理组件清理
 */
onMounted(() => {
  visible.value = true        // 显示通知，触发进入动画
  
  // 如果设置了自动隐藏时间，创建定时器
  if (props.duration > 0) {
    timer = setTimeout(() => {
      visible.value = false   // 隐藏通知，触发离开动画
      
      // 等待离开动画完成后执行
      setTimeout(() => {
        props.onClose()       // 调用传入的关闭回调函数
      }, 300)                 // 300ms 等待动画完成
    }, props.duration)        // 按指定时间延迟执行
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)      // 避免内存泄漏
  }
})
</script>

<!-- 
  - <teleport> Vue 3 传送门功能，将内容渲染到指定DOM节点
  - <transition> Vue 过渡动画组件
  - :class 动态类绑定（数组语法）
  - 模板字符串插值 `toast-${type}`
  - 接收父组件传入的 props 数据
-->
<template>
  <!-- 传送到 body 元素，确保在页面最顶层显示 -->
  <teleport to="body">
    <!-- transition 进入和离开的动画效果 -->
    <transition
        enter-active-class="toast-enter-active" 
        leave-active-class="toast-leave-active"
        enter-from-class="toast-enter-from"        
        leave-to-class="toast-leave-to"            
    >
      <!-- 条件渲染通知框，动态绑定类名 -->
      <div v-if="visible" :class="['toast', `toast-${type}`]">
        <!-- 图标容器，根据通知类型显示不同图标 -->
        <div class="toast-icon">
          <span v-if="type === 'success'">✓</span>        <!-- 成功图标 -->
          <span v-else-if="type === 'error'">✗</span>     <!-- 错误图标 -->
          <span v-else-if="type === 'warning'">⚠</span>   <!-- 警告图标 -->
          <span v-else>ℹ</span>                           <!-- 默认信息图标 -->
        </div>
        <!-- 消息文本容器，插值显示传入的消息 -->
        <div class="toast-message">{{ message }}</div>
      </div>
    </transition>
  </teleport>
</template>


<style scoped lang="scss">
.toast {
  position: fixed;
  top: 50px;
  right: 40%;
//   transform: translateX(50%);
  min-width: 300px;
  max-width: 500px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  display: flex;
  align-items: center;
  /* 用于设置网格或弹性布局容器中项目之间间距的属性 */
  gap: 12px;
  background: white;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #52c41a;
}

.toast-error {
  border-left-color: #ff4d4f;
}

.toast-warning {
  border-left-color: #faad14;
}

.toast-info {
    /* 非sass写法 */
//   border-left-color: var(primaryColor);
    border-left-color: $primaryColor;
}

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold; /* 加粗 */
  color: white;
}

.toast-success .toast-icon {
  background-color: #52c41a;
}

.toast-error .toast-icon {
  background-color: #ff4d4f;
}

.toast-warning .toast-icon {
  background-color: #faad14;
}

.toast-info .toast-icon {
  background-color: $primaryColor;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.4;
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style> 