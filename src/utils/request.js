import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // 向接口发送请求
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, //跨域请求时发送cookies
  timeout: 5000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带令牌
      config.headers['satoken'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.status !== 200) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008：非法token；50012：其他客户端已登录；50014：令牌已过期；
      // if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
      //   // to re-login
      //   MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // return Promise.reject(new Error(res.message || '错误'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: '出了点小问题！请检查您的网络状态~',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
