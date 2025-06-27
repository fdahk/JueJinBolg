// 获取搜索历史的功能单独集成了一个类作为工具在前端的utils里面，这里的API的通过这个类来调用
import httpInstance from '@/utils/http'

export const searchApi = {
  // 获取搜索内容
  getSearchContents(params) {
  return httpInstance({
    url: '/search/contents',
    method: 'GET',
    params
  })
  },
  // 保存搜索历史
  saveSearchHistory(data) {
    return httpInstance.post('/search/history', data)
  },

  // 获取搜索历史
  getSearchHistory(params) {
    return httpInstance.get('/search/history', { params })
  },

  // 删除搜索历史
  deleteSearchHistory(data) {
    return httpInstance.delete('/search/history', { data })
  }
} 