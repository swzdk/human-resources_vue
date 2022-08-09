import router from '@/router'
import store from '@/store'
// 引入进度条插件及样式
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const loginView = '/login'
const notFoundView = '/404'
const whiteViews = [loginView, notFoundView]
// 创建前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 路由跳转前开启进度条
  nProgress.start()
  // 获取token
  const token = store.getters.token
  // 如果有token,判断是否要去登录界面
  if (token) {
    // 如果没有用户信息，获取用户信息
    if (!store.getters.userId) {
      const res = await store.dispatch('user/getUserInfo')
      // 获取到用户消息后，配置路由权限(将menu传入)
      const permissionList = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // 添加动态路由
      router.addRoutes([...permissionList, { path: '*', redirect: '/404', hidden: true }])
      next(to.path)
    }
    // 是，跳转主页
    if (to.path === loginView) {
      next('/')
      nProgress.done()
    } else {
      // 否，放行
      next()
    }
  } else {
    // 没有token，判断是否在白名单内
    // 是，放行
    if (whiteViews.includes(to.path)) {
      next()
    } else {
      // 否，跳转登录界面
      next(loginView)
    }
  }
})
router.afterEach(() => {
  // 路由跳转完成关闭进度条
  nProgress.done()
})
