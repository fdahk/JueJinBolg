import express from 'express'
import db from '../dataBase/index.js'

const router = express.Router()

// 文章获取接口--------------------------------------------------------
// 获取文章列表
router.get('/list', async (req, res) => {
  try {
    const { 
      category = '', 
      page = 1, 
      limit = 10, 
      sortBy = 'createTime',
      sortOrder = 'DESC',
      status = 'published'
    } = req.query

    const offset = (page - 1) * limit
    
    // 构建查询条件
    let whereClause = 'WHERE status = ?'
    const params = [status]
    
    if (category && category !== 'comprehensive') {
      whereClause += ' AND category = ?'
      params.push(category)
    }
    
    // 获取文章列表
    const sql = `
      SELECT 
        articleId,
        title,
        summary,
        author,
        cover,
        category,
        tag,
        viewCount,
        likeCount,
        commentCount,
        status,
        createTime,
        updateTime
      FROM articles 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `
    // 注意：limit和offset的顺序不能颠倒，否则会报错
    params.push(parseInt(limit), parseInt(offset))
    const [articles] = await db.query(sql, params)
    
    // 获取总数
    // 注意：用as给查询结果取别名
    // 在JavaScript中，对象属性名包含特殊字符，不能用点号语法访问，例如括号、空格、*等，只能用方括号语法。
    // 不用as时，数据库返回的原始结果，-- 数据库系统的默认行为：
    // -- 1. 如果没有别名，就用原始表达式作为列名 -- 2. 保持SQL表达式的原样
    // const result = [
    //     {
    //       "COUNT(*)": 156  // 注意：属性名就是 "COUNT(*)"
    //     }
    //   ]
    const countSql = `SELECT COUNT(*) as total FROM articles ${whereClause}`
    const [countResult] = await db.query(countSql, params.slice(0, -2))
    const total = countResult[0].total //.total 是 MySQL 查询结果中的字段名
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: articles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取推荐文章列表
router.get('/recommend', async (req, res) => {
  try {
    const { category = '', limit = 10, page = 1 } = req.query
    
    const offset = (page - 1) * limit
    
    let whereClause = 'WHERE status = ?'
    const params = ['published']
    
    if (category && category !== 'comprehensive') {
      whereClause += ' AND category = ?'
      params.push(category)
    }
    
    // 按浏览量和点赞数排序
    const sql = `
      SELECT 
        articleId,
        title,
        summary,
        author,
        cover,
        category,
        tag,
        viewCount,
        likeCount,
        commentCount,
        createTime
      FROM articles 
      ${whereClause}
      ORDER BY (viewCount * 0.7 + likeCount * 0.3) DESC, createTime DESC
      LIMIT ? OFFSET ?
    `
    
    params.push(parseInt(limit), parseInt(offset))
    const [articles] = await db.query(sql, params)
    
    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM articles ${whereClause}`
    const [countResult] = await db.query(countSql, params.slice(0, -2))
    const total = countResult[0].total
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: articles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取推荐文章失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取最新文章列表
router.get('/latest', async (req, res) => {
  try {
    const { category = '', limit = 10, page = 1 } = req.query
    
    const offset = (page - 1) * limit
    
    let whereClause = 'WHERE status = ?'
    const params = ['published']
    
    if (category && category !== 'comprehensive') {
      whereClause += ' AND category = ?'
      params.push(category)
    }
    
    const sql = `
      SELECT 
        articleId,
        title,
        summary,
        author,
        cover,
        category,
        tag,
        viewCount,
        likeCount,
        commentCount,
        createTime
      FROM articles 
      ${whereClause}
      ORDER BY createTime DESC
      LIMIT ? OFFSET ?
    `
    
    params.push(parseInt(limit), parseInt(offset))
    const [articles] = await db.query(sql, params)
    
    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM articles ${whereClause}`
    const [countResult] = await db.query(countSql, params.slice(0, -2))
    const total = countResult[0].total
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: articles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取最新文章失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 获取文章详情
    const sql = `
      SELECT * FROM articles 
      WHERE articleId = ? AND status IN ('published', 'draft')
    `
    
    const [articles] = await db.query(sql, [id])
    
    if (articles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }
    
    // 增加浏览量
    await db.query(
      'UPDATE articles SET viewCount = viewCount + 1 WHERE articleId = ?',
      [id]
    )
    
    const article = articles[0]
    article.viewCount += 1
    
    res.json({
      code: 200,
      message: '获取成功',
      data: article
    })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 文章作者操作接口--------------------------------------------------------
// 创建文章
router.post('/create', async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      author,
      cover = '',
      category,
      tag = '',
      status = 'draft'
    } = req.body
    
    // 验证必填字段
    if (!title || !content || !author || !category) {
      return res.json({
        code: 400,
        message: '标题、内容、作者和分类为必填字段'
      })
    }
    
    const sql = `
      INSERT INTO articles (
        title, content, summary, author, cover, 
        category, tag, status, createTime, updateTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `
    
    const [result] = await db.query(sql, [
      title, content, summary, author, cover, 
      category, tag, status
    ])
    
    res.json({
      code: 200,
      message: '创建成功',
      data: {
        articleId: result.insertId
      }
    })
  } catch (error) {
    console.error('创建文章失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 更新文章
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      content,
      summary,
      cover,
      category,
      tag,
      status
    } = req.body
    
    // 检查文章是否存在
    const [existingArticles] = await db.query(
      'SELECT articleId FROM articles WHERE articleId = ?',
      [id]
    )
    
    if (existingArticles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }
    
    // 构建更新字段
    const updateFields = []
    const params = []
    
    if (title !== undefined) {
      updateFields.push('title = ?')
      params.push(title)
    }
    if (content !== undefined) {
      updateFields.push('content = ?')
      params.push(content)
    }
    if (summary !== undefined) {
      updateFields.push('summary = ?')
      params.push(summary)
    }
    if (cover !== undefined) {
      updateFields.push('cover = ?')
      params.push(cover)
    }
    if (category !== undefined) {
      updateFields.push('category = ?')
      params.push(category)
    }
    if (tag !== undefined) {
      updateFields.push('tag = ?')
      params.push(tag)
    }
    if (status !== undefined) {
      updateFields.push('status = ?')
      params.push(status)
    }
    
    if (updateFields.length === 0) {
      return res.json({
        code: 400,
        message: '没有要更新的字段'
      })
    }
    
    updateFields.push('updateTime = NOW()')
    params.push(id)
    
    const sql = `
      UPDATE articles 
      SET ${updateFields.join(', ')}
      WHERE articleId = ?
    `
    
    await db.query(sql, params)
    
    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新文章失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 删除文章（软删除）
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 检查文章是否存在
    const [existingArticles] = await db.query(
      'SELECT articleId FROM articles WHERE articleId = ?',
      [id]
    )
    
    if (existingArticles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }
    
    // 软删除（更新状态）
    const sql = `
      UPDATE articles 
      SET status = 'deleted', updateTime = NOW()
      WHERE articleId = ?
    `
    
    await db.query(sql, [id])
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除文章失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 文章详情页交互功能接口-------------------------------------------------------------
// 点赞/取消点赞
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body // 'like' 或 'unlike'
    const userId = req.user?.id || 'anonymous' // 假设从认证中间件获取用户ID

    // 检查文章是否存在
    const [articles] = await db.query(
      'SELECT articleId, likeCount FROM articles WHERE articleId = ?',
      [id]
    )

    if (articles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }

    if (action === 'like') {
      // 检查是否已经点赞
      const [existingLike] = await db.query(
        'SELECT * FROM article_likes WHERE articleId = ? AND userId = ?',
        [id, userId]
      )

      if (existingLike.length > 0) {
        return res.json({
          code: 400,
          message: '已经点过赞了'
        })
      }

      // 添加点赞记录
      await db.query(
        'INSERT INTO article_likes (articleId, userId, createTime) VALUES (?, ?, NOW())',
        [id, userId]
      )

      // 更新文章点赞数
      await db.query(
        'UPDATE articles SET likeCount = likeCount + 1 WHERE articleId = ?',
        [id]
      )

      res.json({
        code: 200,
        message: '点赞成功',
        data: {
          likeCount: articles[0].likeCount + 1,
          isLiked: true
        }
      })
    } else if (action === 'unlike') {
      // 删除点赞记录
      const [result] = await db.query(
        'DELETE FROM article_likes WHERE articleId = ? AND userId = ?',
        [id, userId]
      )

      if (result.affectedRows > 0) {
        // 更新文章点赞数
        await db.query(
          'UPDATE articles SET likeCount = GREATEST(likeCount - 1, 0) WHERE articleId = ?',
          [id]
        )

        res.json({
          code: 200,
          message: '取消点赞成功',
          data: {
            likeCount: Math.max(articles[0].likeCount - 1, 0),
            isLiked: false
          }
        })
      } else {
        res.json({
          code: 400,
          message: '还没有点过赞'
        })
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 收藏/取消收藏
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body // 'favorite' 或 'unfavorite'
    const userId = req.user?.id || 'anonymous'

    // 检查文章是否存在
    const [articles] = await db.query(
      'SELECT articleId FROM articles WHERE articleId = ?',
      [id]
    )

    if (articles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }

    if (action === 'favorite') {
      // 检查是否已经收藏
      const [existingFavorite] = await db.query(
        'SELECT * FROM article_favorites WHERE articleId = ? AND userId = ?',
        [id, userId]
      )

      if (existingFavorite.length > 0) {
        return res.json({
          code: 400,
          message: '已经收藏了'
        })
      }

      // 添加收藏记录
      await db.query(
        'INSERT INTO article_favorites (articleId, userId, createTime) VALUES (?, ?, NOW())',
        [id, userId]
      )

      res.json({
        code: 200,
        message: '收藏成功',
        data: { isFavorited: true }
      })
    } else if (action === 'unfavorite') {
      // 删除收藏记录
      const [result] = await db.query(
        'DELETE FROM article_favorites WHERE articleId = ? AND userId = ?',
        [id, userId]
      )

      if (result.affectedRows > 0) {
        res.json({
          code: 200,
          message: '取消收藏成功',
          data: { isFavorited: false }
        })
      } else {
        res.json({
          code: 400,
          message: '还没有收藏过'
        })
      }
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取文章交互状态
router.get('/:id/interaction', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || 'anonymous'

    // 检查点赞状态
    const [likeResult] = await db.query(
      'SELECT COUNT(*) as isLiked FROM article_likes WHERE articleId = ? AND userId = ?',
      [id, userId]
    )

    // 检查收藏状态  
    const [favoriteResult] = await db.query(
      'SELECT COUNT(*) as isFavorited FROM article_favorites WHERE articleId = ? AND userId = ?',
      [id, userId]
    )

    // 获取统计数据
    const [statsResult] = await db.query(
      'SELECT likeCount, commentCount, viewCount FROM articles WHERE articleId = ?',
      [id]
    )

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        isLiked: likeResult[0].isLiked > 0,
        isFavorited: favoriteResult[0].isFavorited > 0,
        likeCount: statsResult[0]?.likeCount || 0,
        commentCount: statsResult[0]?.commentCount || 0,
        viewCount: statsResult[0]?.viewCount || 0
      }
    })
  } catch (error) {
    console.error('获取交互状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 举报文章
router.post('/:id/report', async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const userId = req.user?.id || 'anonymous'

    // 验证举报原因
    if (!reason || reason.trim().length < 5) {
      return res.json({
        code: 400,
        message: '举报原因至少需要5个字符'
      })
    }

    // 检查文章是否存在
    const [articles] = await db.query(
      'SELECT articleId FROM articles WHERE articleId = ?',
      [id]
    )

    if (articles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }

    // 检查是否已经举报过
    const [existingReport] = await db.query(
      'SELECT * FROM article_reports WHERE articleId = ? AND userId = ?',
      [id, userId]
    )

    if (existingReport.length > 0) {
      return res.json({
        code: 400,
        message: '您已经举报过这篇文章了'
      })
    }

    // 添加举报记录
    await db.query(
      'INSERT INTO article_reports (articleId, userId, reason, createTime) VALUES (?, ?, ?, NOW())',
      [id, userId, reason.trim()]
    )

    res.json({
      code: 200,
      message: '举报成功，我们会尽快处理'
    })
  } catch (error) {
    console.error('举报失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

export default router
