import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  id: '',
  name: '',
  idCard: '',
  avatarUrl: '',
  phone: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_IDCARD: (state, idCard) => {
    state.idCard = idCard
  },
  SET_AVATAURL: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户名登陆
  // 第一个login是$store中的方法
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 请求后台登陆
      // 第二个login方法是，api里的login方法，用来调用接口的
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        // 设置 token，作为用户已登陆的前端标识，存在 cookie 中
        commit('SET_TOKEN', data.token.tokenValue) // 存在vueX中
        setToken(data.token.tokenValue) // 存在cookie中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 请求获取信息
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录')
        }


        // const { roles, name, idCard , avatarUrl, phone } = data
        const { roles, admin } = data
        if (!roles || roles.length <= 0) {
          reject('getInfo: 角色必须是非空数组！')
        }

        commit('SET_ID', admin.id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', admin.name)
        commit('SET_IDCARD', admin.idCard)
        commit('SET_AVATAURL', admin.avatarUrl)
        commit('SET_PHONE', admin.phone)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户登出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // 重置访问过的视图和缓存的视图
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // logout({ commit, state, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     commit('SET_TOKEN', '')
  //     commit('SET_ROLES', [])
  //     removeToken()
  //     resetRouter()
  //     dispatch('tagsView/delAllViews', null, { root: true })
  //     resolve()
  //   })
  // },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态修改权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 根据角色生成可访问的路线图
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // 动态添加可访问路由
    router.addRoutes(accessRoutes)

    // 重置访问过的视图和缓存的视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
