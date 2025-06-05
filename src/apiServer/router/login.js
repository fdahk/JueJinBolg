import express from "express";
import db from "../dataBase/index.js";
// 调试代码，创建数据池
// const pool = db.pool; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config.js';
import { Message } from "@element-plus/icons-vue";

//
const saltRounds = 10; // 定义加密轮数，越大加密越安全，但也越慢
const router = express.Router();

// 账号密码模式注册接口，不用
// router.post("/reg", (req, res) => {
//   const {userName, passWord} = req.body 
//   // 注意捕获异常，避免服务器异常
//   try {
//     const sql = "select * from users where username = ? "
//     // 将 Node.js 的回调风格数据库查询（db.query）转换为 Promise 风格，以便使用 async/ 语法
//     // [checkResults] 使用了解构赋值，因为 db.query 返回的结果是数组，这里取第一个元素（查询结果）
//     const [queryResults] =  new Promise((resolve, reject) => {
//       db.query(sql, [userName], (err, results) => {
//         if (err) reject(err)
//           else resolve(results)
//       })
//     })
//     // 依据查询结果queryResults，判断用户名是否已存在
//     if (queryResults.length > 0) {
//       // 用户名已存在，返回错误信息，请求结束
//       return res.json({code: 400, message: '用户已存在'})
//     }
//     // 用户名未被占用，执行注册操作，将用户名和密码插入数据库
//     const sql2 = 'insert into users (username, password) value(?,?)'
//     // 对密码进行加密
//     const hashedPassword =  bcrypt.hash(password, saltRounds);
//     // 执行插入数据
//      new Promise((resolve, reject) => {
//       db.query(sql2, [userName, passWord], (err, results) => {
//         if (err) reject(err)
//           else resolve(results)
//       })
//     })
//     // 注册成功，返回信息
//     // res.json({code: 200, message: '注册成功'})
//     res.status(201).json({code: 201, message: '注册成功'})
//   }
//   catch (err) {
//     // 服务器错误
//     res.status(500).json({code: 500, message: '服务器错误'})
//   }
// })

// // 登录接口
// router.post("/login", (req, res) => {
//   const {userName, passWord} = req.body
//   try {
//     const sql = 'select * from users where username = ?'
//     const [queryResults] =  new Promise((resolve, reject) => {
//       db.query(sql, [userName], (err, results) => {
//         if (err) reject(err)
//           else resolve(results)
//       })
//     })
//     // 依据查询结果queryResults，判断用户名是否存在
//     if (queryResults.length === 0) {
//       // 用户名不存在，返回错误信息，请求结束
//       return res.json({code: 400, message: '用户名不存在'})
//     }
//     // 用户名存在，比较密码是否正确
//     const user = queryResults // 取查询结果的第一个元素（用户信息）
//     const isMatch =  bcrypt.compare(password, user.password) // 比较密码是否匹配
//     if (!isMatch) {
//       // 密码错误，返回错误信息，请求结束
//       return res.json({code: 400, message: '密码错误'})
//     }
//     // 登录成功，返回信息
//     res.json({code: 200, message: '登录成功'})
//   } catch (err) {
//     // 服务器错误
//     res.status(500).json({code: 500, message: '服务器错误'})
//   }
// })

// 手机号加密登录接口
router.post("/passwordLogin", async(req, res) => {
  const {phone, password} = req.body.params
  try {
    const sql = 'select * from users where phone =?'
    const [userRes] = await db.query(sql, [phone])
    // console.log(userRes) //调试
    if(userRes.length === 0) {
      return res.json({code: 400, message: '用户不存在'})
    }
    if(userRes[0].password !== password) {
      return res.json({code: 400, message: '密码错误'})
    }
    // 生成token
    const token = jwt.sign({phone}, config.jwtSecretKey, {expiresIn: '24h'}) // 24小时过期
    console.log(userRes) //调试
    // res.json({code: 200, message: '登录成功', token: token, userInfo: userRes[0]})
    res.json({code: 200, message: '登录成功', token: token, userName: userRes[0].username, userPic: userRes[0].userpic})  
  }catch {
    res.status(500).json({code: 500, message: '服务器错误'})
  }
  
})

// 手机号+验证码登录接口
// 1.发送验证码接口
router.post("/sendCaptcha", async (req, res) => {
  // console.log(req) //调试
  const {phone} = req.body.params
  console.log(phone) //调试
  // 手机号校验
  //。。。。。。。。。。
  try {
    const captcha = Math.floor(Math.random()*1000000).toString().padStart(6, '0')
    // 有效期1分钟
    const expireTime = new Date(Date.now() + 60000)
    // 存储验证码和过期时间
    const sql = 'insert into captchas (phone, captcha, expireTime) values(?,?,?)'
    // 执行插入数据,注意写法 
    await db.query(sql, [phone, captcha, expireTime]) 
    // 一分钟后删除数据
    setTimeout(async () => {
      await db.query("DELETE FROM captchas WHERE phone=?", [phone]);
    }, 60000)
    // 模拟发送验证码,实际开发中需要调用短信服务
    res.json({code: 200, Message: '验证码发送成功'+`${captcha}`})
  } catch(err) {
    res.status(500).json({code: 500, message: '服务器错误'})
    console.log(err)
  }
})

// 2.验证码登录接口
router.post("/captchaLogin", async (req, res) => {
  const {phone, captcha} = req.body.params 
  // phone = String(phone);
  // captcha = String(captcha);
  // console.log(phone, captcha) //调试
  // 校验逻辑
  // 。。。。。。。。。。。。。、
  try {
    const sql = 'select * from tjlogs.captchas where phone =? and captcha =? and expireTime >now()'
    // 打印预处理后的 SQL（用于调试）,报错了不知道为什么
    // const debugSql = db.pool.format(sql, [phone, captcha]);
    // console.log('实际执行的 SQL:', debugSql); //验证实际执行sql调试
    // const R = await db.query('select * from captchas') 
    // console.log(R)
    const [captchaRes] = await db.query(sql, [phone,captcha]) 
    // console.log(captchaRes) //调试
    if(captchaRes.length === 0) {
      return res.json({code: 400, message: '验证码错误或已过期'})
    }
    // 检查是否是新用户
    const sql2 = 'select * from users where phone =?'
    const [userRes] = await db.query(sql2, [phone])
    // 生成token
    const token = jwt.sign({phone}, config.jwtSecretKey, {expiresIn: '4h'}) // 24小时过期
    if(userRes.length ===0) {
      // 新用户，自动注册
      const sql3 = 'insert into users (phone, username) values(?,?)'
      // 默认用户名是手机号后四位
      await db.query(sql3, [phone, `user_${phone.slice(-4)}`])
      res.json({code: 200, message: '注册成功', token: token})
    } else {
      res.json({code: 200, message: '登录成功', token: token})
    }

  }catch(err) {
    res.status(500).json({code: 500, message: '服务器错误'})
   console.log(err)
  }
})
export default router;