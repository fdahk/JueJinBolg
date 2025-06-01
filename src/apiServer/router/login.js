import express from "express";
import db from "../dataBase/index.js";
import bcrypt from 'bcrypt';

//
const saltRounds = 10; // 定义加密轮数，越大加密越安全，但也越慢
const router = express.Router();

// 注册接口
router.post("/reg", (req, res) => {
  const {userName, passWord} = req.body 
  // 注意捕获异常，避免服务器异常
  try {
    const sql = "select * from users where username = ? "
    // 将 Node.js 的回调风格数据库查询（db.query）转换为 Promise 风格，以便使用 async/ 语法
    // [checkResults] 使用了解构赋值，因为 db.query 返回的结果是数组，这里取第一个元素（查询结果）
    const [queryResults] =  new Promise((resolve, reject) => {
      db.query(sql, [userName], (err, results) => {
        if (err) reject(err)
          else resolve(results)
      })
    })
    // 依据查询结果queryResults，判断用户名是否已存在
    if (queryResults.length > 0) {
      // 用户名已存在，返回错误信息，请求结束
      return res.json({code: 400, message: '用户已存在'})
    }
    // 用户名未被占用，执行注册操作，将用户名和密码插入数据库
    const sql2 = 'insert into users (username, password) value(?,?)'
    // 对密码进行加密
    const hashedPassword =  bcrypt.hash(password, saltRounds);
    // 执行插入数据
     new Promise((resolve, reject) => {
      db.query(sql2, [userName, passWord], (err, results) => {
        if (err) reject(err)
          else resolve(results)
      })
    })
    // 注册成功，返回信息
    // res.json({code: 200, message: '注册成功'})
    res.status(201).json({code: 201, message: '注册成功'})
  }
  catch (err) {
    // 服务器错误
    res.status(500).json({code: 500, message: '服务器错误'})
  }
})

// 登录接口
router.post("/login", (req, res) => {
  const {userName, passWord} = req.body
  try {
    const sql = 'select * from users where username = ?'
    const [queryResults] =  new Promise((resolve, reject) => {
      db.query(sql, [userName], (err, results) => {
        if (err) reject(err)
          else resolve(results)
      })
    })
    // 依据查询结果queryResults，判断用户名是否存在
    if (queryResults.length === 0) {
      // 用户名不存在，返回错误信息，请求结束
      return res.json({code: 400, message: '用户名不存在'})
    }
    // 用户名存在，比较密码是否正确
    const user = queryResults // 取查询结果的第一个元素（用户信息）
    const isMatch =  bcrypt.compare(password, user.password) // 比较密码是否匹配
    if (!isMatch) {
      // 密码错误，返回错误信息，请求结束
      return res.json({code: 400, message: '密码错误'})
    }
    // 登录成功，返回信息
    res.json({code: 200, message: '登录成功'})
  } catch (err) {
    // 服务器错误
    res.status(500).json({code: 500, message: '服务器错误'})
  }
})

export default router;