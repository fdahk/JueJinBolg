// 传统写法
// 导入 mysql 模块
//const mysql = require('mysql') // commonjs写法不支持
// import mysql from 'mysql'
//  // 创建数据库连接对象
// const db = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: 'Tj@19970924',
//   // 不管大小写好像都可以？
//   database: 'tjLogs',
//   // charset: 'utf8mb4',  // 关键：确保字符集与 Workbench 一致
//  })
//  // 向外共享 db 数据库连接对象
// // module.exports = db 这是commonjs的写法


//....................................................................
// 推荐版本:mysql2/promise 是 Node.js 中用于操作 MySQL 数据库的优秀库，支持 Promise 语法 npm install mysql2
// 该写法不能用回调函数，因为回调函数的参数是固定的，不能自定义，只能用then和catch，不能用await和async
import mysql from 'mysql2/promise'
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Tj@19970924',
  database: 'tjlogs',
  waitForConnections: true, // 当连接池无可用连接时，是否等待
  connectionLimit: 10, // 连接池最大连接数
  queueLimit: 0 // 连接请求队列限制，0 表示无限制  
})


// 数据库测试代码
// 传统版
// db.query('select 1', (err, results) => {
//   if (err) return console.log(err.message)
//   console.log(results)
// })
// 现代版
// console.log(await db.query('select 1'));
export default db