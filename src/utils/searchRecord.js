
import { searchApi } from '@/apis/search.js'

// 搜索记录管理类
class SearchRecord {
  constructor() {
    // 定义localStorage中存储搜索记录的键名，用于浏览器本地存储
    this.LOCAL_KEY = 'searchRecord'
    // 设置本地存储的最大记录数量，防止占用过多浏览器存储空间
    this.MAX_LOCAL_COUNT = 10
    // 当前登录用户的手机号，初始为null（未登录状态）
    this.userPhone = null
  }

  // 设置当前用户手机号的方法，用于用户登录后绑定身份
  setUserPhone(userPhone) {
    // 将传入的用户手机号赋值给实例属性，用于后续服务器API调用时识别用户
    this.userPhone = userPhone
  }

  // 获取本地存储的搜索历史记录
  getLocalHistory() {
    try {
      // 从浏览器localStorage中获取搜索记录，返回JSON字符串或null
      const history = localStorage.getItem(this.LOCAL_KEY)
      // 如果存在记录则解析JSON字符串为数组，否则返回空数组
      return history ? JSON.parse(history) : []
    } catch (error) {
      // 捕获可能的JSON解析错误或localStorage访问错误
      console.error('获取本地搜索历史失败:', error)
      // 出错时返回空数组，确保程序继续运行
      return []
    }
  }

  // 保存到本地存储的方法
  saveToLocal(keyword) {
    try {
      // 首先获取现有的搜索历史记录
      const history = this.getLocalHistory()
      
      // 数据处理逻辑：
      // 1. 将新关键词放在数组最前面（最新搜索在前）
      // 2. 使用filter过滤掉历史中已存在的相同关键词（去重）
      // 3. 使用slice截取前MAX_LOCAL_COUNT条记录（限制数量）
      const newHistory = [keyword, ...history.filter(item => item !== keyword)]
        .slice(0, this.MAX_LOCAL_COUNT)
      
      // 将处理后的数组转换为JSON字符串，存储到localStorage
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(newHistory))
      // 返回新的历史记录数组
      return newHistory
    } catch (error) {
      console.error('保存本地搜索历史失败:', error)
      // 返回空数组，避免undefined
      return []
    }
  }

  // 从本地存储中删除搜索记录
  removeFromLocal(keyword) {
    try {
      // 获取当前的搜索历史记录
      const history = this.getLocalHistory()
      // 条件判断：
      // 如果传入了keyword参数，则过滤掉该关键词（删除指定记录）
      // 如果没有传入keyword（为null/undefined），则返回空数组（清空所有记录）
      const newHistory = keyword 
        ? history.filter(item => item !== keyword)  // 删除指定关键词
        : []                                        // 清空所有记录
      
      // 将更新后的记录保存回localStorage
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(newHistory))
      // 返回更新后的历史记录
      return newHistory
    } catch (error) {
      // 删除操作失败时的错误处理
      console.error('删除本地搜索历史失败:', error)
      // 返回空数组保证程序稳定性
      return []
    }
  }

  // 防抖函数
  debounce(func, wait) {
    // 存储定时器ID
    let timeout
    // 返回一个新的函数，这个函数具有防抖功能
    return function executedFunction(...args) {
      // 定义延迟执行的函数
      const later = () => {
        clearTimeout(timeout)
        // 执行原始函数，并传入所有参数
        func(...args)
      }
      // 每次调用时先清除之前的定时器（这是防抖的关键）
      clearTimeout(timeout)
      // 设置新的定时器，在wait毫秒后执行later函数
      timeout = setTimeout(later, wait)
    }
  }

  // 保存到服务器的方法
  async saveToServer(keyword) {
    // 检查用户是否已登录，未登录则无法保存到服务器
    if (!this.userPhone) return

    // 异常处理：网络请求可能失败
    try {
      // 调用搜索API的保存历史方法，发送POST请求到后端
      await searchApi.saveSearchHistory({
        // 传递用户ID，用于服务器端识别用户身份
        userPhone: this.userPhone,
        // 传递搜索关键词
        keyword
      })
    } catch (error) {
      // 服务器保存失败时使用warn级别日志（不是严重错误）
      // 因为本地保存已经成功，用户体验不受影响
      console.warn('保存搜索历史到服务器失败:', error)
    }
  }

  // 保存搜索记录，本地存储和服务器
  async save(keyword) {
    // 参数校验：检查关键词是否为空或只包含空白字符
    if (!keyword || keyword.trim() === '') return

    // 去除关键词首尾空白字符，标准化处理
    const trimmedKeyword = keyword.trim()
    
    // 立即保存到本地存储，确保用户界面快速响应
    const localHistory = this.saveToLocal(trimmedKeyword)
    
    // 如果用户已登录，则异步同步到服务器
    if (this.userPhone) {
      // 创建防抖版本的服务器保存函数（如果尚未创建）
      // 使用逻辑或运算符实现惰性初始化
      this.debouncedSaveToServer = this.debouncedSaveToServer || 
        // （1秒）延迟的防抖函数
        // bind(this)确保saveToServer方法中的this指向当前实例
        this.debounce(this.saveToServer.bind(this), 1000)
      
      // 调用防抖版本的保存函数，避免频繁的服务器请求
      this.debouncedSaveToServer(trimmedKeyword)
    }

    // 返回本地历史记录，供调用者立即使用
    return localHistory
  }


  // 获取搜索历史，优先使用本地数据，然后同步服务器数据
  async getHistory() {
    // 立即获取本地历史记录，确保快速响应
    const localHistory = this.getLocalHistory()
    
    // 如果用户已登录，尝试从服务器获取更完整的历史记录
    if (this.userPhone) {
      // 网络请求异常处理
      try {
        const serverResponse = await searchApi.getSearchHistory({
          // 传递用户ID
          userPhone: this.userPhone,
          // 请求20条记录（比本地存储的10条更多）
          limit: 20
        })
        
        // 检查服务器响应是否成功
        if (serverResponse.data.code === 200) {
          // 提取服务器返回的历史记录数组，如果为空则使用空数组
          const serverHistory = serverResponse.data.data || []
          
          // 合并本地和服务器的历史记录
          // 优先级：服务器数据 > 本地独有数据
          const mergedHistory = [
            // 首先添加所有服务器历史记录
            ...serverHistory,
            // 然后添加本地独有的记录（不在服务器历史中的）
            ...localHistory.filter(item => !serverHistory.includes(item))
          ].slice(0, this.MAX_LOCAL_COUNT) // 限制总数量
          
          // 将合并后的记录更新到本地存储，实现数据同步
          localStorage.setItem(this.LOCAL_KEY, JSON.stringify(mergedHistory))
          
          // 返回合并后的完整历史记录
          return mergedHistory
        }
      } catch (error) {
        // 服务器请求失败时的降级处理
        // 使用warn级别，因为本地功能仍然可用
        console.warn('获取服务器搜索历史失败，使用本地历史:', error)
      }
    }
    // 如果用户未登录或服务器请求失败，返回本地历史记录 
    return localHistory
  }

  // 删除搜索历史记录，同时删除本地和服务器数据
  async remove(keyword = null) {
    // 立即从本地存储删除，确保用户界面快速更新
    const localHistory = this.removeFromLocal(keyword)
    
    // 如果用户已登录，同时从服务器删除对应记录
    if (this.userPhone) {
      try {
        await searchApi.deleteSearchHistory({
          // 传递用户ID
          userPhone: this.userPhone,
          // 传递要删除的关键词（null表示删除所有记录）
          keyword
        })
      } catch (error) {
        // 使用warn级别，因为本地删除已经成功
        console.warn('删除服务器搜索历史失败:', error)
      }
    }

    // 返回删除后的本地历史记录
    return localHistory
  }

}

// 创建SearchRecord类的单例实例
// 使用单例模式确保整个应用中只有一个搜索记录管理器
const searchRecord = new SearchRecord()

// default导出，其他文件可以直接import使用
export default searchRecord