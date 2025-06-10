import httpInstance from '@/utils/http'

// 获取历史搜索记录
export const getHistoryList = ({userName}) => {
  return httpInstance.get('/api/historyList', {
    params: {userName}
  })
}

// 获取搜索内容
export const getSearchContents = ({searchQuery}) => {
  return httpInstance.get('/api/searchContents', {
    params :{searchQuery}
  })
}