import express  from "express";
import db from "../dataBase/index.js"
const router = express.Router();

// 处理搜索请求

router.get('/searchContents', (req, res) => {
  const {searchQuery} = req.query;
  // const sql = `select keyWords, contents from searchContents where keyWords like '%${searchQuery}%'`
  const sql = `select keyWords, contents from searchdatas where keyWords like '${searchQuery}`
  db.query(sql,[searchQuery], (err, results) => {
    if(err) {
      console.log(err.message)
      return err
    }
    else {
      res.json(results)
    }
  })
  // res.json({searchQuery: `${searchQuery}` , isAc: "Yes"})
})

router.get('/historyList', (req, res) => {
  const {username} = req.query
  // db.query()
})
export default router