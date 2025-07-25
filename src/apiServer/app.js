// 导入 express 模块
//  const express = require('express') // es语法不能这样引入
import express from 'express'

// 创建 express 的服务器实例
const app = express()
// 导入密钥
import {config} from './config.js'
// token解析中间件
import expressJWT from 'express-jwt'
// 导入 cors 中间件
import  cors from 'cors'
// 将 cors 注册为全局中间件
app.use(cors())
// 部署静态资源托管，将dist目录下的文件托管为静态资源
import path from 'path'
import { fileURLToPath } from 'url'
// 兼容 ES Module 下的 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 静态托管 dist 目录
app.use(express.static(path.resolve(__dirname, '../../dist')))
// 让前端路由支持 history 模式,返回静态资源
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
// })

// 引入路由
import search from './router/search.js'
import login from './router/login.js';
import user from './router/user.js';
import article from './router/article.js'  // 文章路由
import userArticle from './router/userArticle.js'  // 用户文章路由
// 错误级别中间件，接受四个参数在express中视为错误中间件，统一错误响应
// 不建议有有第一个err参数，因为err会被express识别为错误，会被后续中间件覆盖
// 三个参数作为普通中间件，每个请求都可用
// app.use(( req, res, next) => {
//   res.cc = (err, status = 1) => {
//     res.send({
//       // 状态
//       status,
//       // 状态描述，判断 err 是 错误对象 还是 字符串
//       message: err instanceof Error ? err.message : err,
//     })
//       // 捕获身份认证失败的错误
//       //if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
//   }
//   //  调用 next 函数，将错误传递给下一个中间件或路由处理程序
//   next()
// })
// 解析json数据的中间件，增加请求体大小限制以支持图片上传
app.use(express.json({ limit: '10mb' }))  // 增加到10MB以支持Base64图片
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api',search)
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证,注意要在login路由之前
// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//]}))
app.use('/api', login);
app.use('/user', user);
app.use('/api/article', article) 
app.use('/api/userArticle', userArticle)
app.use('/search', search)
// 调用 app.listen 方法，指定端口号并启动web服务器
// app.listen(3007, function () {
//   console.log('api server running at http://127.0.0.1:3007')
//  })

const port = process.env.PORT || 3007 // 从环境变量中获取端口号，如果没有则使用3007
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})