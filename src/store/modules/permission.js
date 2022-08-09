import { constantRoutes, asyncRoutes } from '@/router/index'

const state = {
  routes: constantRoutes
}

const mutations = {
  getRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  filterRoutes(context, menu) {
    // 获取到接口返回的路由名称，并进行筛选
    const newRoutes = asyncRoutes.filter(item => menu.includes(item.name))
    // 将路由列表合并
    context.commit('getRoutes', newRoutes)
    // 返回动态路由
    return newRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
