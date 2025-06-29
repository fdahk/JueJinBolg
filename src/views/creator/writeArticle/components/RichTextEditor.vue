<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { 
  Link, Operation, ArrowDown,Back, ArrowRight, Picture
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  maxLength: {
    type: Number,
    default: 50000
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const editorRef = ref(null)
const content = ref(props.modelValue)
const isComposing = ref(false)
const history = ref([])
const historyIndex = ref(-1)
const currentSelection = ref(null)

// 监听 props 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.innerHTML = newValue
      }
    })
  }
}, { immediate: true })

// 字数统计
// 不能用getPlainText() 函数，其没有响应式数据，不能实现响应式驱动，content.value 是响应式数据
const wordCount = computed(() => {
  if (!content.value) return 0
  // 从 HTML 中提取纯文本
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content.value//需要中间桥梁，实现响应式
  const text = tempDiv.innerText || tempDiv.textContent || ''
  
  return text.length
})
// 行数
// 无效
// const lineCount = computed(() => {
//   if (!content.value) return 0
//   // 从 HTML 中提取纯文本
//   const tempDiv = document.createElement('div')
//   tempDiv.innerHTML = content.value 
//   const text =tempDiv.textContent || tempDiv.innerText  || ''
//   return text.split('\n').length 
// })
//计算行数
const lineCount = computed(() => {
  if (!content.value) return 1
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content.value
  // 优先检查块级元素
  const blockElements = tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, li, blockquote')
  if (blockElements.length > 0) {
    return blockElements.length
  }
  // 检查 br 标签
  const brElements = tempDiv.querySelectorAll('br')
  if (brElements.length > 0) {
    return brElements.length + 1
  }
  // 文本分割（最后的选择）
  const text = tempDiv.textContent || ''
  if (!text.trim()) return 1
  
  const lines = text.split('\n').filter(line => line.trim())
  return Math.max(1, lines.length)
})

// 正文字数
const textCount = computed(() => {
  if (!content.value) return 0
  // 从 HTML 中提取纯文本
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content.value
  const text = tempDiv.innerText || tempDiv.textContent || ''
  
  return text.replace(/\s/g, '').length
})

// 获取纯文本内容
const getPlainText = () => {
  if (!editorRef.value) return ''
  return editorRef.value.innerText || editorRef.value.textContent || ''
}

// 保存当前选择状态
const saveSelection = () => {
  const selection = window.getSelection() // 有些浏览器可以有多个选中
  if (selection.rangeCount > 0) {
    currentSelection.value = selection.getRangeAt(0).cloneRange() // 克隆第一个选中范围
  }
}

// 恢复选择状态
const restoreSelection = () => {
  if (currentSelection.value) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(currentSelection.value)
  }
}

// 保存历史记录
const saveHistory = () => {
  const currentContent = editorRef.value.innerHTML
  if (history.value[historyIndex.value] !== currentContent) {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(currentContent)
    historyIndex.value = history.value.length - 1
    
    // 限制历史记录数量
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }
}

// 撤回
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    const previousContent = history.value[historyIndex.value]
    editorRef.value.innerHTML = previousContent
    content.value = previousContent
    emit('update:modelValue', previousContent)
  }
}

// 重做
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    const nextContent = history.value[historyIndex.value]
    editorRef.value.innerHTML = nextContent
    content.value = nextContent
    emit('update:modelValue', nextContent)
  }
}

// 格式化命令
const execCommand = (command, value = null) => {
  try {
    // 确保编辑器有焦点
    editorRef.value.focus()
    // 保存历史记录（在执行命令前）
    saveHistory()
    // 执行命令
    if (command === 'bold' || command === 'italic' || command === 'strikeThrough') {
      // 被废除了
      document.execCommand(command, false, value)
    } else {
      document.execCommand(command, false, value)
    }
    
    // 触发更新
    handleInput()
    
    // 延迟保存历史记录
    setTimeout(() => {
      saveHistory()
    }, 100)
    
  } catch (error) {
    console.error('执行命令失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 格式化状态检测
const isActive = (command) => {
  try {
    return document.queryCommandState(command) 
  } catch (error) {
    // 备用检测方法
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return false
    
    const range = selection.getRangeAt(0)
    let node = range.startContainer
    
    // 如果是文本节点，获取其父元素
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement
    }
    
    // 检查当前节点及其父节点，Node.TEXT_NODE 是一个数字常量，值为 3，用来表示文本节点的类型
    while (node && node !== editorRef.value) {
      const tagName = node.tagName?.toLowerCase()
      switch (command) {
        case 'bold':
          if (tagName === 'strong' || tagName === 'b') return true
          break
        case 'italic':
          if (tagName === 'em' || tagName === 'i') return true
          break
        case 'strikethrough':
          if (tagName === 'del' || tagName === 's' || tagName === 'strike') return true
          break
      }
      
      node = node.parentElement
    }
    
    return false
  }
}

// 处理输入
const handleInput = (shouldSaveHistory = false) => {
  if (isComposing.value) return
  
  const html = editorRef.value.innerHTML
  
  // 检查字数限制
  if (getPlainText().length > props.maxLength) {
    ElMessage.warning(`内容超出字数限制（${props.maxLength}字）`)
    return
  }
  
  content.value = html
  emit('update:modelValue', html)
  emit('input', html)
  emit('change', html)
  
  // 根据参数决定是否保存历史记录
  if (shouldSaveHistory) {
    clearTimeout(handleInput.timer)
    handleInput.timer = setTimeout(() => {
      saveHistory()
    }, 1000)
  }
}

// 处理中文输入
const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
  handleInput(true)
}

// 处理键盘快捷键
const handleKeydown = (e) => {
  // Ctrl+B 粗体
  if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    e.preventDefault()
    execCommand('bold')
  }
  // Ctrl+I 斜体
  else if (e.ctrlKey && e.key.toLowerCase() === 'i') {
    e.preventDefault()
    execCommand('italic')
  }
  // Ctrl+Z 撤销
  else if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  }
  // Ctrl+Y 或 Ctrl+Shift+Z 重做
  else if (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
    e.preventDefault()
    redo()
  }
  // Tab 缩进
  else if (e.key === 'Tab') {
    e.preventDefault()
    execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
  }
  // Enter 换行处理
  else if (e.key === 'Enter' && !e.shiftKey) {
    // 让浏览器处理默认的换行行为，不需要自定义
    // 只在需要时保存历史记录
    setTimeout(() => {
      handleInput(true)
    }, 10)
  }
}

// 插入链接
const insertLink = () => {
  const selection = window.getSelection()
  let selectedText = ''
  
  if (selection.rangeCount > 0) {
    selectedText = selection.toString()
  }
  
  const url = prompt('请输入链接地址:', 'https://')
  if (url && url.trim()) {
    if (selectedText) {
      execCommand('createLink', url)
    } else {
      const linkText = prompt('请输入链接文本:', url)
      if (linkText) {
        execCommand('insertHTML', `<a href="${url}" target="_blank">${linkText}</a>`)
      }
    }
  }
}

// 插入代码块
const insertCode = () => {
  const selection = window.getSelection()
  let selectedText = ''
  
  if (selection.rangeCount > 0) {
    selectedText = selection.toString()
  }
  
  if (selectedText) {
    const codeHtml = `<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: Monaco, Consolas, 'Courier New', monospace; font-size: 0.9em;">${selectedText}</code>`
    execCommand('insertHTML', codeHtml)
  } else {
    const codeText = prompt('请输入代码内容:', '代码')
    if (codeText) {
      const codeHtml = `<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: Monaco, Consolas, 'Courier New', monospace; font-size: 0.9em;">${codeText}</code>`
      execCommand('insertHTML', codeHtml)
    }
  }
}

// 处理标题
const handleHeading = (command) => {
  execCommand('formatBlock', command)
}

// 插入图片
const insertImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 检查文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const imgHtml = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;" alt="图片">`
        execCommand('insertHTML', imgHtml)
      }
      reader.readAsDataURL(file)
    }
  }
  
  input.click()
}

// 清空内容
const clearContent = () => {
    saveHistory() // 保存清空前的状态
    editorRef.value.innerHTML = ''
    content.value = ''
    emit('update:modelValue', '')
    saveHistory() // 保存清空后的状态
}

// 初始化
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = content.value || ''
    // 初始化历史记录
    saveHistory()
    // 设置占位符
    if (!content.value) {
      editorRef.value.setAttribute('data-placeholder', props.placeholder)
    }
  }
})

// 处理粘贴
const handlePaste = (e) => {
  e.preventDefault()
  
  const clipboardData = e.clipboardData || window.clipboardData
  let pastedData = clipboardData.getData('text/html') || clipboardData.getData('text')
  
  if (pastedData) {
    // 清理粘贴的HTML内容
    pastedData = pastedData
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
    
    execCommand('insertHTML', pastedData)
  }
}

// 处理焦点事件
const handleFocus = () => {
  saveSelection()
}

const handleBlur = () => {
  saveSelection()
  handleInput(true)
}
</script>

<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 撤销重做 -->
      <el-button-group>
        <el-button @click="undo" :disabled="historyIndex <= 0" title="撤销 (Ctrl+Z)">
          <el-icon><Back /></el-icon>
        </el-button>
        <el-button @click="redo" :disabled="historyIndex >= history.length - 1" title="重做 (Ctrl+Y)">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </el-button-group>

      <!-- 文本格式 -->
      <el-button-group>
        <el-button @click="execCommand('bold')" :class="{ active: isActive('bold') }" title="粗体 (Ctrl+B)">
          <strong style="font-weight: 900;">B</strong>
        </el-button>
        <el-button @click="execCommand('italic')" :class="{ active: isActive('italic') }" title="斜体 (Ctrl+I)">
          <em style="font-style: italic;">I</em>
        </el-button>
        <el-button @click="execCommand('strikeThrough')" :class="{ active: isActive('strikeThrough') }" title="删除线">
          <span style="text-decoration: line-through;">S</span>
        </el-button>
      </el-button-group>

      <!-- 插入功能 -->
      <el-button-group>
        <el-button @click="insertLink" title="插入链接">
          <el-icon><Link /></el-icon>
        </el-button>
        <el-button @click="insertCode" title="插入代码">
          <el-icon><Operation /></el-icon>
        </el-button>
        <el-button @click="insertImage" title="插入图片">
          <el-icon><Picture /></el-icon>
        </el-button>
      </el-button-group>
      
      <!-- 标题 -->
      <el-button-group>
        <el-dropdown @command="handleHeading">
          <el-button>
            标题 <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="h1">标题 1</el-dropdown-item>
              <el-dropdown-item command="h2">标题 2</el-dropdown-item>
              <el-dropdown-item command="h3">标题 3</el-dropdown-item>
              <el-dropdown-item command="p">正文</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>

      <!-- 清空 -->
      <el-button @click="clearContent" title="清空内容" type="danger" size="small">
        清空
      </el-button>
    </div>

    <!-- 编辑器 -->
     <!-- 输入的内容作为 该div 元素的子节点显示（innerHTML）-->
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable
      @input="handleInput(true)"
      @compositionstart="handleCompositionStart" 
      @compositionend="handleCompositionEnd"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @focus="handleFocus"
      @blur="handleBlur"
      :data-placeholder="content ? '' : placeholder"
    ></div>

    <!-- 字数统计和状态栏 -->
    <div class="editor-footer">
      <span>字数：{{ wordCount }}/{{ maxLength }}</span>
      <span>行数：{{ lineCount }}</span>
      <span>正文字数：{{ textCount }}</span>
      <span class="status" :class="{ warning: wordCount > maxLength * 0.9 }">
        {{ wordCount > maxLength ? '超出字数限制' : wordCount > maxLength * 0.9 ? '接近字数限制' : '正常' }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;

  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #fafafa;
    flex-wrap: wrap;
    
    .el-button {
      &.active {
        background-color: #409eff;
        color: white;
        border-color: #409eff;
      }
      
      &:disabled {
        opacity: 0.5;
      }
    }
  }

  .editor-content {
    min-height: 400px;
    max-height: 600px;
    padding: 12px;
    outline: none;
    line-height: 1.6;
    overflow-y: auto;
    font-size: 14px;
    
    &:focus {
      border-color: #409eff;
    }
    
    &[data-placeholder]:empty::before {
      content: attr(data-placeholder);
      color: #c0c4cc;
      pointer-events: none;
    }
    
    h1, h2, h3 {
      margin: 16px 0 8px 0;
      font-weight: 600;
    }
    
    h1 {
      font-size: 24px;
    }
    
    h2 {
      font-size: 20px;
    }
    
    h3 {
      font-size: 16px;
    }
    
    p {
      margin: 8px 0;
    }
    
    ul, ol {
      padding-left: 24px;
      margin: 8px 0;
      
      li {
        margin: 4px 0;
      }
    }
    
    table {
      margin: 16px 0;
      border-collapse: collapse;
      width: 100%;
      
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f5f5f5;
        font-weight: 600;
      }
    }
    
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: Monaco, Consolas, "Courier New", monospace;
      font-size: 0.9em;
    }
    
    a {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
      border-radius: 4px;
    }
    
    blockquote {
      margin: 16px 0;
      padding: 12px 16px;
      background-color: #f9f9f9;
      border-left: 4px solid #409eff;
      font-style: italic;
    }
  }

  .editor-footer {
    display: flex;
    gap: 16px;
    padding: 8px 12px;
    background-color: #fafafa;
    border-top: 1px solid #dcdfe6;
    font-size: 12px;
    color: #606266;
    justify-content: space-between;
    align-items: center;
    
    .status {
      &.warning {
        color: #e6a23c;
        font-weight: 500;
      }
    }
  }
}
</style>