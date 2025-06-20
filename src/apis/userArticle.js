import httpInstance from '@/utils/http'

// 用户文章交互相关 API
export const userArticleApi = {
    // 文章作者操作接口----------------------------------------
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

    // 文章详情页交互功能----------------------------------------
    // 点赞/取消点赞
    toggleLike(articleId, action = 'like', userPhone = null) {
    return httpInstance({
        url: `/api/userArticle/${articleId}/like`,
        method: 'POST',
        data: { 
            action,
            phone: userPhone || 'anonymous'
        }
    })
    },

    // 收藏/取消收藏
    toggleFavorite(articleId, action = 'favorite', userPhone = null) {
    return httpInstance({
        url: `/api/userArticle/${articleId}/favorite`,
        method: 'POST',
        data: { 
            action,
            phone: userPhone || 'anonymous'
        }
    })
    },

    // 获取文章交互状态
    getInteraction(articleId, userPhone = null) {
    return httpInstance({
        url: `/api/userArticle/${articleId}/interaction`,
        method: 'GET',
        params: {
            phone: userPhone || 'anonymous'
        }
    })
    },

    // 举报文章
    reportArticle(articleId, reason, userPhone = null) {
    return httpInstance({
        url: `/api/userArticle/${articleId}/report`,
        method: 'POST',
        data: { 
            reason,
            phone: userPhone || 'anonymous'
        }
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
    addComment(articleId, data, userPhone = null) {
    return httpInstance({
        url: `/api/userArticle/${articleId}/comments`,
        method: 'POST',
        data: {
            ...data,
            phone: userPhone || 'anonymous'
        }
    })
    }
}

export default userArticleApi