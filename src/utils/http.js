import axios from 'axios'
import { showToast } from '@/utils/toast'
// 统一请求前缀
const baseURL = 'http://127.0.0.1:3007'
const httpInstance = axios.create({
  baseURL,
  timeout: 10000
})

//请求拦截器

// 响应拦截器


export default httpInstance