// 导入 mysql 模块
//const mysql = require('mysql') // commonjs写法不支持
import mysql from 'mysql'
 // 创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Tj@19970924',
  database: 'tjLogs',
 })
 // 向外共享 db 数据库连接对象
// module.exports = db 这是commonjs的写法
export default db


// 数据库测试代码
// db.query('select 1', (err, results) => {
//   if (err) return console.log(err.message)
//   console.log(results)
// })