import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取令牌
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/auth-redirect'] // 无重定向白名单

// 路由拦截器
router.beforeEach(async(to, from, next) => {
  // 启动进度条
  NProgress.start()

  // 设置目标页面的title（从目标路由的meta中获取title）
  document.title = getPageTitle(to.meta.title)

  // 获取store里面的登陆令牌，有令牌，表示有登陆
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果有登陆，并且目标路径是/login，路由到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取登陆用户的角色，能获取到，表示有角色信息，否则就调用getInfo，获取当前登陆用户的角色信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果角色存在则进行下一步
      if (hasRoles) {
        next()
      } else {
        // 如果角色不存在
        try {
          // 获取角色
          const { roles } = await store.dispatch('user/getInfo')
          // 基于角色生成可访问的路线图
          // 根据用户的角色信息，派发到permisson/generateRoutes action.生成动态路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问的路由
          // 挂载动态路由
          router.addRoutes(accessRoutes)

          // hack方法以确保addRoutes是完整的
          // replace设置成true 为的是让用户登录进去之后点击浏览器回退，会退到空白页而不是登录页
          next({ ...to, replace: true })
        } catch (error) {
          // 如果出现异常 把token清空 roles清空 cookie清空
          await store.dispatch('user/resetToken')
          // 打印错误
          Message.error(error || '错误')
          // 重定向到login 并带上上次访问的路由
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 如果没有token */
    // 如果路由存在白名单里
    if (whiteList.indexOf(to.path) !== -1) {
      // 那就访问此路由
      next()
    } else {
      // 如果路由不存在白名单里，那就跳转到登录页 并带上上次访问的路由
      next(`/login?redirect=${to.path}`)
      // 结束滚动条
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束滚动条
  NProgress.done()
})
