import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  // 获取cookie中的token
  token: getToken()
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    // 登录时注入token
    state.token = token
    // 放入cookie持久化
    setToken(state.token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
  // 登录请求
  async login(context, data) {
    // 获取token
    const res = await login(data)
    // 存入vuex
    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
