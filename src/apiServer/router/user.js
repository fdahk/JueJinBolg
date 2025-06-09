import express from "express";
import db from "../dataBase/index.js";
const router = express.Router(); 

router.put('/updateUserInfo', (req, res) => {
    const { userName, startWorkDate, profession, position, company, website, introduction, userPhone } = req.body;
    // 注意逗号，不要漏掉或多
    const sql = `UPDATE users SET username = ?, startworkdate = ?, profession = ?, position = ?, company = ?, website = ?, introduction = ? WHERE phone = ?`;
    try {
        const updateRes = db.query(sql, [userName, startWorkDate, profession, position, company, website, introduction, userPhone]);
        if (updateRes.affectedRows > 0) {
            return res.json({
                code: 200,
                message: '更新成功'
            })
        } else {
            return res.json({
                code: 400,
                message: '更新失败'
            })
        }
    } catch (error) {
        return res.json({
            code: 500,
            message: '服务器错误'
        })
    }
})

export default router