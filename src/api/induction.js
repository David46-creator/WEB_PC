import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/induction/list',
    method: 'get',
    params: query
  })
}

export function createInduction(data) {
  return request({
    url: '/vue-element-admin/induction/create',
    method: 'post',
    data
  })
}

export function updateInduction(data) {
  return request({
    url: '/vue-element-admin/induction/update',
    method: 'post',
    data
  })
}

export function deleteInduction(data) {
  return request({
    url: '/vue-element-admin/induction/delete',
    method: 'post',
    data
  })
}

