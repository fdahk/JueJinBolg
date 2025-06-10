import express from "express";
import db from "../dataBase/index.js";
const router = express.Router(); 

// 更新用户信息-----------------------------------------------
router.put('/updateUserInfo', async (req, res) => {
    const { userName, startWorkDate, profession, position, company, website, introduction, userPhone } = req.body;
    
    // 验证必填字段
    // 测试
    console.log(userPhone)   
    if (!userName || !startWorkDate || !profession) {
        return res.json({
            code: 400,
            message: '缺少必填字段'
        });
    }

    
    // 注意逗号，不要漏掉或多
    const sql = `UPDATE users SET userName = ?, startWorkDate = ?, profession = ?, position = ?, company = ?, website = ?, introduction = ? WHERE userPhone = ?`;
    
    try {
        // 避免未定义，使用||
        const [updateRes] = await db.query(sql, [userName, startWorkDate, profession, position || '', company || '', website || '', introduction || '', userPhone]);
        
        if (updateRes.affectedRows > 0) {
            return res.json({
                code: 200,
                message: '更新成功',
                data: {
                    userName,
                    startWorkDate,
                    profession,
                    position,
                    company,
                    website,
                    introduction
                }
            });
        } else {
            return res.json({
                code: 400,
                message: '更新失败，未找到对应用户'
            });
        }
    } catch (error) {
        console.error('数据库更新错误:', error);
        return res.json({
            code: 500,
            message: '服务器错误：' + error.message
        });
    }
})

// 更新头像-----------------------------------------------
router.put('/updateUserPic', async (req, res) => {
    const {userPic, userPhone} = req.body
    const sql = 'update users set userPic = ? where userPhone = ?'
    try {
        const [updateRes] = await db.query(sql, [userPic, userPhone])
        if(updateRes.affectedRows > 0) {
            return res.json({
                code: 200,
                message: '更新成功',
                data: {
                    userPic
                }
            })
        } else {
            return res.json({
                code: 400,
                message: '更新失败，未找到对应用户'
            })
        }
    } catch (error) {
        console.error('数据库更新错误:', error);
        return res.json({
            code: 500,
            message: '服务器错误：' + error.message
        })
    }
})
export default router