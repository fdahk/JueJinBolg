// 格式化时间
export const formatTime = (timeString) => {
    if (!timeString) return ''
    
    try {
      const time = new Date(timeString)
      
      // 检查日期是否有效
      if (isNaN(time.getTime())) {
        return timeString // 如果无法解析，返回原始字符串
      }
      
      const now = new Date()
      const diff = now - time
      
      // 确保diff是正数
      if (diff < 0) {
        return time.toLocaleDateString('zh-CN')
      }
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      // 
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 30) return `${days}天前`
      return time.toLocaleDateString('zh-CN')
    } catch (error) {
      console.error('时间格式化错误:', error, timeString)
      return timeString
    }
  }

// 相对时间，多语言和自定义配置
export const formatRelativeTime = (time, options = {}) => {
  const {
    lang = 'zh-CN',
    showSeconds = true,
    showWeeks = false,
    maxUnit = 'year'
  } = options
  
  const now = new Date()
  const targetTime = new Date(time)
  const diff = now - targetTime
  
  const units = {
    'zh-CN': {
      just: '刚刚',
      second: '秒前',
      minute: '分钟前',
      hour: '小时前',
      day: '天前',
      week: '周前',
      month: '个月前',
      year: '年前'
    },
    'en-US': {
      just: 'just now',
      second: 's ago',
      minute: 'm ago',
      hour: 'h ago',
      day: 'd ago',
      week: 'w ago',
      month: 'mo ago',
      year: 'y ago'
    }
  }
  
  const text = units[lang] || units['zh-CN']
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 10) return text.just
  if (showSeconds && seconds < 60) return `${seconds}${text.second}`
  if (minutes < 60) return `${minutes}${text.minute}`
  if (hours < 24) return `${hours}${text.hour}`
  if (days < 7 || !showWeeks) {
    if (days < 30) return `${days}${text.day}`
  } else {
    if (weeks < 4) return `${weeks}${text.week}`
  }
  if (maxUnit === 'month' || months < 12) return `${months}${text.month}`
  if (maxUnit === 'year') return `${years}${text.year}`
  
}