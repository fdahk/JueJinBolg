 // 导入 express 模块
//  const express = require('express') // es语法不能这样引入
import express from 'express'
 // 创建 express 的服务器实例
const app = express()

  // 导入 cors 中间件
import  cors from 'cors'
// 将 cors 注册为全局中间件
app.use(cors())

 // 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
 })
