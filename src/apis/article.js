import axios from 'axios'
import httpInstance from '@/utils/http'



// 文章相关 /api/article
export const articleApi = {
  // 文章获取接口----------------------------------------
  // 获取文章列表
  getArticleList(params = {}) {
    return httpInstance({
      url: '/api/article/list',
      method: 'GET',
      params
    })
  },

  // 获取推荐文章
  getRecommendArticles(params = {}) {
    return httpInstance({
      url: '/api/article/recommend',
      method: 'GET',
      params
    })
  },

  // 获取最新文章
  getLatestArticles(params = {}) {
    return httpInstance({
      url: '/api/article/latest',
      method: 'GET',
      params
    })
  },

  // 获取文章详情
  getArticleDetail(id) {
    return httpInstance({
      url: `/api/article/detail/${id}`,
      method: 'GET'
    })
  },

  // 文章操作接口----------------------------------------
  // 创建文章
  createArticle(data) {
    return httpInstance({
      url: '/api/article/create',
      method: 'POST',
      data
    })
  },

  // 更新文章
  updateArticle(id, data) {
    return httpInstance({
      url: `/api/article/update/${id}`,
      method: 'PUT',
      data
    })
  },

  // 删除文章
  deleteArticle(id) {
    return httpInstance({
      url: `/api/article/delete/${id}`,
      method: 'DELETE'
    })
  },
}

// 导出默认对象
export default articleApi
