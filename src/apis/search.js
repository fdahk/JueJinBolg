import httpInstance from '@/utils/http'

// 获取历史搜索记录
export const getSearchList = ({username}) => {
  httpInstance.get('/api/search', {username})
}
