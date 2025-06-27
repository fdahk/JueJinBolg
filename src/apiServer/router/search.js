import express  from "express";
import db from "../dataBase/index.js"
const router = express.Router();
import redis from '../redis/index.js'

// 获取搜索历史,废除
// router.get('/getHistory', async (req, res) => {
//   try {
//     const {userPhone, limit = 5, page = 1} = req.query
//     const offset = (page - 1) * limit
//     const sql = 'SELECT * FROM search_records WHERE userPhone = ? ORDER BY createTime DESC LIMIT ? OFFSET ?'
//     const [results] = await db.query(sql, [userPhone, limit, offset])
//     res.json({
//       code: 200,
//       message: '获取搜索历史成功',
//       data: results
//     })
//   } catch (error) {
//     console.error('获取搜索历史失败:', error)
//     res.status(500).json({
//       code: 500,
//       message: '获取搜索历史失败'
//     })
//   }
// })

// 保存搜索记录
router.post('/history', async (req, res) => {
  try {
    const { userPhone, keyword } = req.body
    
    // 参数验证
    if (!userPhone || !keyword || keyword.trim() === '') {
      return res.json({
        code: 400,
        message: '参数不能为空'
      })
    }

    const trimmedKeyword = keyword.trim()
    const userSearchKey = `user:search:${userPhone}` // 用户搜索记录的key
    
    // 1. 更新 Redis 缓存（用户个人历史）
    try {
      await redis.zadd(userSearchKey, Date.now(), trimmedKeyword)
      // 只保留最近 10 条记录
      await redis.zremrangebyrank(userSearchKey, 0, -11)
      // 设置过期时间 30 天
      await redis.expire(userSearchKey, 86400 * 30)
    } catch (redisError) {
      console.warn('Redis 保存失败，继续执行:', redisError)
    }

    // 2. 更新 MySQL 数据库（异步执行，不阻塞响应）
    setImmediate(async () => {
      try {
        const sql = `INSERT INTO searchrecords (userPhone, keyword, searchCount) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE searchCount = searchCount + 1`
        const [results] = await db.query(sql, [userPhone, trimmedKeyword])
        // console.log(results)
       
      } catch (dbError) {
        console.error('数据库保存搜索记录失败:', dbError)
      }
    })
    res.json({
      code: 200,
      message: '保存成功'
    })

  } catch (error) {
    console.error('保存搜索记录失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取搜索历史
router.get('/history', async (req, res) => {
  try {
    const { userPhone, limit = 10 } = req.query
    
    if (!userPhone) {
      return res.json({
        code: 400,
        message: '用户ID不能为空'
      })
    }

    const userSearchKey = `user:search:${userPhone}`
    let history = []

    // 1. 优先从 Redis 获取
    try {
      const redisHistory = await redis.zrevrange(userSearchKey, 0, parseInt(limit) - 1)
      if (redisHistory && redisHistory.length > 0) {
        history = redisHistory
      }
    } catch (redisError) {
      console.warn('Redis 获取失败，从数据库获取:', redisError)
    }

    // 2. Redis 为空时从数据库获取
    if (history.length === 0) {
      try {
        const sql = `SELECT keyword, lastSearchTime FROM searchrecords WHERE userPhone = ? ORDER BY lastSearchTime DESC LIMIT ?`
        const [dbResults] = await db.query(sql, [userPhone, parseInt(limit)])

        history = dbResults.map(row => row.keyword)

        // 3. 回写到 Redis
        if (history.length > 0) {
          const multi = redis.multi()
          dbResults.forEach((row, index) => {
            const score = new Date(row.lastSearchTime).getTime()
            multi.zadd(userSearchKey, score, row.keyword)
          })
          multi.expire(userSearchKey, 86400 * 30)
          await multi.exec()
        }
      } catch (dbError) {
        console.error('数据库获取搜索历史失败:', dbError)
        return res.status(500).json({
          code: 500,
          message: '获取搜索历史失败'
        })
      }
    }

    res.json({
      code: 200,
      data: history,
      message: '获取成功'
    })

  } catch (error) {
    console.error('获取搜索历史失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 删除搜索历史
router.delete('/history', async (req, res) => {
  try {
    const { userPhone, keyword } = req.body
    
    if (!userPhone) {
      return res.json({
        code: 400,
        message: '用户ID不能为空'
      })
    }

    const userSearchKey = `user:search:${userPhone}`

    if (keyword) {
      // 删除指定关键词
      await redis.zrem(userSearchKey, keyword)
      await db.query('DELETE FROM searchrecords WHERE userPhone = ? AND keyword = ?', [userPhone, keyword])
    } else {
      // 清空所有历史
      await redis.del(userSearchKey)
      await db.query('DELETE FROM searchrecords WHERE userPhone = ?', [userPhone])
    }

    res.json({
      code: 200,
      message: '删除成功'
    })

  } catch (error) {
    console.error('删除搜索历史失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除失败'
    })
  }
})

// 获取搜索内容
router.get('/contents', async (req, res) => {
  try {
    // 注意parseInt()，http请求的参数是字符串，需要转换为数字
    const {searchQuery, limit = 5, page = 1, sort} = req.query
    const offset = (page - 1) * limit
    const searchPattern = `%${searchQuery}%`
    const sql = `SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? OR summary LIKE ? OR tag LIKE ? ORDER BY ${sort} DESC LIMIT ? OFFSET ?`
    const [results] = await db.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern, parseInt(limit), parseInt(offset)])
    res.json({
      code: 200,
      message: '获取搜索内容成功',
      data: results
    })
  } catch (error) {
    console.error('获取搜索内容失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取搜索内容失败'
    })
  }
  
})

export default router