import axios from 'axios'

const request = axios.create({})

// 请求拦截器
request.interceptors.request.use()
// 响应拦截器
request.interceptors.response.use()

export default request
