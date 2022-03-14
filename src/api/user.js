import request from '@/utils/request'

// 登陆
export function login(data) {
  return request({
    url: '/api/admins/login',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getInfo(saToken) {
  return request({
    url: '/api/admins/SelfProfile',
    method: 'get',
    params: { saToken }
  })
}

// 登出
export function logout() {
  return request({
    url: '/api/admins/logOut',
    method: 'post',
  })
}
