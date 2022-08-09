import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  // 获取cookie中的token
  token: getToken(),
  userInfo: {
  }
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
  },
  setGetUserInfo(state, payload) {
    // 修改userInfo
    state.userInfo = payload
  },
  clearUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录请求
  async login(context, data) {
    // 获取token
    const res = await login(data)
    // 登录成功，存入时间戳
    setTime()
    // 存入vuex
    context.commit('setToken', res)
  },

  // 请求用户数据
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 根据id获取详细数据
    const info = await getUserDetailById(res.userId)
    // 合并数据并传入vuex
    context.commit('setGetUserInfo', { ...res, ...info })
    // 将结果返回
    return { ...res, ...info }
  },

  // 退出登录
  logout({ commit }) {
    // 清除用户信息
    commit('clearUserInfo')
    // 清除token
    commit('removeToken')
    // 清除路由信息
    resetRouter()
    // 清除vuex中关于路由的信息
    commit('permission/getRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
