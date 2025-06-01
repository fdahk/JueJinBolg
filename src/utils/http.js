import axios from 'axios'
// 统一请求前缀
const baseURL = 'http://127.0.0.1:3007'
const httpInstance = axios.create({
  baseURL,
  timeout: 10000
})
export default httpInstance