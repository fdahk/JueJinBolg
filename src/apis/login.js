import http from "@/utils/http";

// 账号密码登录请求
// 没有实现复杂的数据预校验，后期可以来补充一下
export const handleLogin = async ({userName, passWord}) => {
  if(!userName || !passWord){
    return Promise.reject('请输入用户名和密码')
  }
  return http.post( '/api/login', {userName, passWord})
  // 可以添加成功后的逻辑，跳转等
}

// 验证码登录请求
//获取验证码请求
export const handleGetCaptchaReq = ({phone}) => {
  return http.post( '/api/sendCaptcha', {
    params : {phone}
  })
}

//验证码登录/注册请求 
export const handleCaptchaLoginReq = ({phone, captcha}) => {
  return http.post( '/api/captchaLogin', 
    {
      params : {phone, captcha}
    }
  )}