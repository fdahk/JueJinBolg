import http from "@/utils/http";
// 登录请求
export const handleLogin = async ({userName, passWord}) => {
  return http.post( '/api/login', {userName, passWord})
}

// 注册请求
export const handleReg = ({userName, passWord}) => {
  return http.post( '/api/reg', {userName, passWord})
}