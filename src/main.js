import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS 样式初始化

import Element from 'element-ui'
import './styles/element-variables.scss'
import XLSX from 'xlsx'
Vue.prototype.XLSX = XLSX

import '@/styles/index.scss' // 公共 CSS

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 权限控制
import './utils/error-log' // error log

import * as filters from './filters' // 全局过滤器


/**
  *如果您不想使用模拟服务器
  *您想将MockJs用于mockapi
  *您可以执行：mockXHR（）
  *目前，MockJs将用于生产环境，
  *请在上线前将其删除
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置element-ui的默认大小
})

// 注册全局实用程序过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
