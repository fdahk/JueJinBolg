import express from 'express'
import db from '../dataBase/index.js'

const router = express.Router()

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
    //req.params 包含路由路径中定义的动态参数
    const { id } = req.params
    // console.log(req.body) // 测试
    const { action, phone } = req.body 

    // console.log('请求参数:', { id, action, phone }) // 调试

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

    // 检查用户是否已有交互记录
    const [existingRecord] = await db.query(
      'SELECT * FROM userarticles WHERE articleId = ? AND phone = ?',
      [id, phone]
    )

    // console.log('现有记录:', existingRecord) // 测试

    if (action === 'like') {
      if (existingRecord.length > 0) {
        // 用户已有记录，检查是否已经点赞
        if (existingRecord[0].isLike === '1') {
          return res.json({
            code: 400,
            message: '已经点过赞了'
          })
        }
        
        // 更新现有记录，设置为点赞
        await db.query(
          'UPDATE userarticles SET isLike = ? WHERE articleId = ? AND phone = ?',
          ['1', id, phone]
        )
      } else {
        // 创建新的交互记录
        await db.query(
          'INSERT INTO userarticles (articleId, phone, isLike, myComment, isCollect) VALUES (?, ?, ?, ?, ?)',
          [id, phone, '1', '', '0']
        )
      }

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
      if (existingRecord.length === 0 || existingRecord[0].isLike !== '1') {
        return res.json({
          code: 400,
          message: '还没有点过赞'
        })
      }

      // 检查用户是否还有其他交互（评论或收藏）
      const hasOtherInteractions = existingRecord[0].myComment || existingRecord[0].isCollect === '1'
      
      if (hasOtherInteractions) {
        // 有其他交互，只更新点赞状态
        await db.query(
          'UPDATE userarticles SET isLike = ? WHERE articleId = ? AND phone = ?',
          ['0', id, phone]
        )
      } else {
        // 没有其他交互，删除整条记录
        await db.query(
          'DELETE FROM userarticles WHERE articleId = ? AND phone = ?',
          [id, phone]
        )
      }

      // 更新文章点赞数（确保不为负数）
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
      return res.json({
        code: 400,
        message: '无效的操作类型'
      })
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    console.error('错误详情:', error.message) // 添加详细错误信息
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message // 开发环境下可以返回具体错误
    })
  }
})

// 收藏/取消收藏
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body // 'favorite' 或 'unfavorite'
    const phone = req.user?.phone || req.body.phone || 'anonymous'

    // 检查文章是否存在
    const [articles] = await db.query(
      'SELECT articleId, collectCount FROM articles WHERE articleId = ?',
      [id]
    )
    // console.log('articles', articles) // 测试
    if (articles.length === 0) {
      return res.json({
        code: 404,
        message: '文章不存在'
      })
    }

    // 检查用户是否已有交互记录
    const [existingRecord] = await db.query(
      'SELECT * FROM userarticles WHERE articleId = ? AND phone = ?',
      [id, phone]
    )

    if (action === 'favorite') {
      if (existingRecord.length > 0) {
        // 用户已有记录，检查是否已经收藏
        if (existingRecord[0].isCollect === '1') {
          return res.json({
            code: 400,
            message: '已经收藏了'
          })
        }
        
        // 更新现有记录，设置为收藏
        await db.query(
          'UPDATE userarticles SET isCollect = ? WHERE articleId = ? AND phone = ?',
          ['1', id, phone]
        )

      } else {
        // 创建新的交互记录
        await db.query(
          'INSERT INTO userarticles (articleId, phone, isLike, myComment, isCollect) VALUES (?, ?, ?, ?, ?)',
          [id, phone, '0', '', '1']
        )
      }
      // 更新文章收藏数
      await db.query(
        'UPDATE articles SET collectCount = collectCount + 1 WHERE articleId = ?',
        [id]
      )
      res.json({
        code: 200,
        message: '收藏成功',
        data: { isFavorited: true, collectCount: articles[0].collectCount + 1 }
      })
      
    } else if (action === 'unfavorite') {
      if (existingRecord.length === 0 || existingRecord[0].isCollect !== '1') {
        return res.json({
          code: 400,
          message: '还没有收藏过'
        })
      }

      // 检查用户是否还有其他交互（点赞或评论）
      const hasOtherInteractions = existingRecord[0].isLike === '1' || existingRecord[0].myComment
      
      if (hasOtherInteractions) {
        // 有其他交互，只更新收藏状态
        await db.query(
          'UPDATE userarticles SET isCollect = ? WHERE articleId = ? AND phone = ?',
          ['0', id, phone]
        )
      } else {
        // 没有其他交互，删除整条记录
        await db.query(
          'DELETE FROM userarticles WHERE articleId = ? AND phone = ?',
          [id, phone]
        )
      }

      // 更新文章收藏数
      await db.query(
        'UPDATE articles SET collectCount = GREATEST(collectCount - 1, 0) WHERE articleId = ?',
        [id]
      )
      res.json({
        code: 200,
        message: '取消收藏成功',
        data: { isFavorited: false, collectCount: Math.max(articles[0].collectCount - 1, 0) }
      })
    } else {
      return res.json({
        code: 400,
        message: '无效的操作类型'
      })
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
})

// 获取用户与文章交互状态
router.get('/:id/interaction', async (req, res) => {
  try {
    const { id } = req.params
    const phone = req.user?.phone || req.query.phone || 'anonymous'

    // 检查用户对该文章的交互状态
    const [interactionResult] = await db.query(
      'SELECT isLike, isCollect FROM userarticles WHERE articleId = ? AND phone = ?',
      [id, phone]
    )

    // 获取文章统计数据
    const [statsResult] = await db.query(
      'SELECT likeCount, commentCount, viewCount, collectCount FROM articles WHERE articleId = ?',
      [id]
    )

    const interaction = interactionResult[0] || { isLike: '0', isCollect: '0' }
    const stats = statsResult[0] || { likeCount: 0, commentCount: 0, viewCount: 0, collectCount: 0 }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        isLike: interaction.isLike === '1',
        isCollect: interaction.isCollect === '1',
        likeCount: stats.likeCount,
        commentCount: stats.commentCount,
        viewCount: stats.viewCount,
        collectCount: stats.collectCount
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
    const phone = req.user?.id || 'anonymous'

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
    'SELECT * FROM article_reports WHERE articleId = ? AND phone = ?',
    [id, phone]
    )

    if (existingReport.length > 0) {
    return res.json({
        code: 400,
        message: '您已经举报过这篇文章了'
    })
    }

    // 添加举报记录
    await db.query(
    'INSERT INTO article_reports (articleId, phone, reason, createTime) VALUES (?, ?, ?, NOW())',
    [id, phone, reason.trim()]
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