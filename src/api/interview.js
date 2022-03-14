import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/interview/list',
    method: 'get',
    params: query
  })
}

export function createInterview(data) {
  return request({
    url: '/vue-element-admin/interview/create',
    method: 'post',
    data
  })
}

export function updateInterview(data) {
  return request({
    url: '/vue-element-admin/interview/update',
    method: 'post',
    data
  })
}

export function deleteInterview(data) {
  return request({
    url: '/vue-element-admin/interview/delete',
    method: 'post',
    data
  })
}

