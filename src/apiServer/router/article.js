import express from 'express'
import db from '../dataBase/index.js'

const router = express.Router()

// 文章操作接口--------------------------------------------------------

// 创建文章
router.post('/create', async (req, res) => {
  const { author, title, content, summary, cover, category, tag,status,userPhone } = req.body
  try {
    const sql = `INSERT INTO articles 
    (title, content, summary, tag, category, cover, author,status,createTime,updateTime,userPhone) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`
    const [result] = await db.query(sql, [title, content, summary, tag, category, cover, author,status,userPhone])
    res.json({ code: 200, message: '创建成功', data: result })
  } catch (error) {
    console.error('创建文章失败:', error)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})
// 更新文章
router.put('/update', async (req, res) => {
  const data = req.body
  try {
    const sql = `UPDATE articles SET title = ?, content = ?, summary = ?, tag = ?, category = ?, cover = ?, author = ?, status = ?, userPhone = ? WHERE articleId = ?`
    const [result] = await db.query(sql, [data.title, data.content, data.summary, data.tag, data.category, data.cover, data.author, data.status, data.userPhone, data.articleId])
    res.json({ code: 200, message: '更新成功', data: result })
  } catch (error) {
    console.error('更新文章失败:', error)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

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



export default router
