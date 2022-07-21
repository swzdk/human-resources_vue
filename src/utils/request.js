import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use()
// 响应拦截器,解构axios封装的数据结果
request.interceptors.response.use(({ data: { data, message, success }}) => {
  // 如果服务端返回success，return data
  if (success) return data
  // 否则，返回reject让api捕获
  else {
    Message.error(message || '服务器错误！')
    return Promise.reject(message || '服务器错误！')
  }
})

export default request
