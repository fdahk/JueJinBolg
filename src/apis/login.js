import httpInstance from "@/utils/http";
// 是 Express 框架的内部模块路径，不应该在前端代码中引入，会导致前端构建失败（找不到该模块）
// import { param } from "express/lib/request";

// 账号密码登录请求
// 没有实现复杂的数据预校验，后期可以来补充一下
export const handlePasswordLoginReq =  ({userPhone, password}) => {
  if(!userPhone || !password){
    return '请输入用户名和密码'
  }
  return httpInstance.post( '/api/passwordLogin', 
    {
      params: {userPhone, password}
    })
  // 可以添加成功后的通用逻辑，跳转等
}

// 验证码登录请求
//获取验证码请求
export const handleGetCaptchaReq = ({userPhone}) => {
  return httpInstance.post( '/api/sendCaptcha', {
    params : {userPhone}
  })
  // 成功逻辑
}

//验证码登录/注册请求 
export const handleCaptchaLoginReq = ({userPhone, captcha}) => {
  return httpInstance.post( '/api/captchaLogin', 
    {
      params :{userPhone, captcha}
    })
}

// 修改密码请求
export const handleUpdatePasswordReq = ({userPhone, password,captcha}) => {
  return httpInstance.post( '/api/updatePassword', {
    params :{userPhone, password,captcha}
  })
}