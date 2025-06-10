import express  from "express";
import db from "../dataBase/index.js"
const router = express.Router();

// 处理搜索请求
// router.get('/searchContents', (req, res) => {
//   // console.log(req.query) //调试
//   const {searchQuery} = req.query
//   // 注意要有通配符%
//   // const sql = `select keyWords, contents from searchContents where keyWords like '%${searchQuery}%'`
//   const sql = 'select keyWords, contents from searchdatas where keyWords like ?' 
//   db.query(sql,[searchQuery], (err, results) => {
//     if(err) {
//       console.log(err.message)
//       return err
//     }
//     else {
//       res.json(results)
//     }
//   })
//   // res.json({searchQuery: `${searchQuery}` , isAc: "Yes"})
// })
//新写法
router.get('/searchContents', async (req, res) => {
  // console.log(req.query) //调试
  // 不用params？？？
  const {searchQuery} = req.query
  // 注意要有通配符%
  // const sql = `select keyWords, contents from searchContents where keyWords like '%${searchQuery}%'`
  const sql = 'select keyWords, contents from searchdatas where keyWords like ?' 
  const [results] = await db.query(sql,[searchQuery])
  res.json(results)
})


router.get('/historyList', (req, res) => {
  const {userName} = req.query
  // db.query()
})
export default router