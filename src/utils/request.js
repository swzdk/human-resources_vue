import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTime } from './auth'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
const timeout = 1000 * 60 * 60
function isTimeout() {
  return (Date.now() - getTime() >= timeout)
}
// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    // 有token时，查看是否超时
    if (isTimeout()) {
      // 超时登出
      store.dispatch('user/logout')
      // 跳转到登录页
      router.push('/login')
      Message.error('用户信息超时，请重新登录！')
      return Promise.reject(new Error('token超时了'))
    }
    // 有token时，请求头注入token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 响应拦截器,解构axios封装的数据结果
request.interceptors.response.use(({ data: { data, message, success }}) => {
  // 如果服务端返回success，return data
  if (success) return data
  // 否则，返回reject让api捕获
  else {
    Message.error(message || '服务器错误！')
    return Promise.reject(message || '服务器错误！')
  }
}, err => {
  // 对于非200-300状态码的错误，会在此
  if (err.request.status === 401) {
    // 退出登录
    store.dispatch('user/logout')
    // 跳转到登录页
    router.push('/login')
    Message.error('用户信息超时，请重新登录！')
    // 返回reject
    return Promise(new Error('用户信息不正确'))
  }
})

export default request
