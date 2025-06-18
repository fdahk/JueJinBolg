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