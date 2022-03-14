import { asyncRoutes, constantRoutes } from '@/router'

/**
 *
 * 使用 meta.role以确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // roles.some => Array.some 相当于是只要有一个满足就为true

  // 判断用户的权限于当前路由访问所需要的权限是否有一个满足
  // 比如说用户权限为 ['one','two']  当前路由访问所需要权限为 ['two','three']  那么就说明当前用户可以访问这个路由
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 默认是可访问的
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param 路由异步路由
 * @param 角色
 *
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // 判断当前路由是否可以访问
    if (hasPermission(roles, tmp)) {
      // 如果当前路由还有子路由
      if (tmp.children) {
        // 进行递归处理
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 将可访问路由放入数组中
      res.push(tmp)
    }
  })
  // 返回
  return res
}

const state = {
  routes: [],
  addRoutes: []
}
// 为什么要写这里呢，因为后面的Sidebar组件与这个环环相扣
const mutations = {
  SET_ROUTES: (state, routes) => {
    // 添加的路由
    state.addRoutes = routes
    // 将vuex中的路由进行更新
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 定义一个变量，用来存放可以访问的路由表
      let accessedRoutes
      // 判断当前角色列表中，是否包含超级管理员用户
      if (roles.includes('superAdministrator')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 利用 filterAsyncRoutes 过滤出可访问的路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 保存可访问的路由到store中
      commit('SET_ROUTES', accessedRoutes)
      // 将可访问路由返回
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
