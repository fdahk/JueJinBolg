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
      url: `/api/article/${id}`,
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

  // 新增的交互功能接口----------------------------------------
  
  // 点赞/取消点赞
  toggleLike(articleId, action = 'like') {
    return httpInstance({
      url: `/api/userArticle/${articleId}/like`,
      method: 'POST',
      data: { action }
    })
  },

  // 收藏/取消收藏
  toggleFavorite(articleId, action = 'favorite') {
    return httpInstance({
      url: `/api/userArticle/${articleId}/favorite`,
      method: 'POST',
      data: { action }
    })
  },

  // 获取文章交互状态（点赞、收藏状态）
  getArticleInteraction(articleId) {
    return httpInstance({
      url: `/api/userArticle/${articleId}/interaction`,
      method: 'GET'
    })
  },

  // 举报文章
  reportArticle(articleId, reason) {
    return httpInstance({
      url: `/api/userArticle/${articleId}/report`,
      method: 'POST',
      data: { reason }
    })
  },

  // 获取文章评论
  getComments(articleId, params = {}) {
    return httpInstance({
      url: `/api/userArticle/${articleId}/comments`,
      method: 'GET',
      params
    })
  },

  // 添加评论
  addComment(articleId, data) {
    return httpInstance({
      url: `/api/userArticle/${articleId}/comments`,
      method: 'POST',
      data
    })
  }
}

// 导出默认对象
export default articleApi
