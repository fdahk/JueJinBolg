import { marked } from 'marked' // npm install marked : 解析markdown
import highLightPlugin from 'highlight.js' // npm install highlight.js ：代码高亮插件
import 'highlight.js/styles/github.css' // 代码高亮样式


// marked 库的全局配置方法，设置 Markdown 解析器的行为和渲染选项，影响所有后续的 marked() 调用
marked.setOptions({
    // 代码高亮函数，解析时会调用 highlight 函数
    highlight: function(code, lang) {
      if (lang && highLightPlugin.getLanguage(lang)) {
         // 指定语言
        return highLightPlugin.highlight(code, { language: lang }).value
      }
      // 自动检测语言
      return highLightPlugin.highlightAuto(code).value
    },
    breaks: true, // 将单个换行符 \n 转换为 <br> 标签，false: 需要两个换行符才能产生换行
  
      // 启用 GitHub 风格的 Markdown (GitHub Flavored Markdown)
      // 额外支持表格语法，删除线 ，任务列表 ，自动链接识别，代码块语法高亮标识
    gfm: true
  })


// 导出渲染函数
export const renderMarkdown = (content) => {
    return marked(content)
  }
  
// 导出配置好的 marked 实例
export { marked }