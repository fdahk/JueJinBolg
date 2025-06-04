import httpInstance from "@/utils/http";
// 是 Express 框架的内部模块路径，不应该在前端代码中引入，会导致前端构建失败（找不到该模块）
// import { param } from "express/lib/request";

// 账号密码登录请求
// 没有实现复杂的数据预校验，后期可以来补充一下
export const handleLogin = async ({userName, passWord}) => {
  if(!userName || !passWord){
    return Promise.reject('请输入用户名和密码')
  }
  return httpInstance.post( '/api/login', 
    {
      params: {userName, passWord}
    })
  // 可以添加成功后的逻辑，跳转等
}

// 验证码登录请求
//获取验证码请求
export const handleGetCaptchaReq = ({phone}) => {
  return httpInstance.post( '/api/sendCaptcha', {
    params : {phone}
  })
  // 成功逻辑
}

//验证码登录/注册请求 
export const handleCaptchaLoginReq = ({phone, captcha}) => {
  return httpInstance.post( '/api/captchaLogin', 
    {
      params :{phone, captcha}
    })
}