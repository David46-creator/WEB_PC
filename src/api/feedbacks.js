import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/feedbacks/list',
    method: 'get',
    params: query
  })
}

export function createFeedbacks(data) {
  return request({
    url: '/vue-element-admin/feedbacks/create',
    method: 'post',
    data
  })
}

export function updateFeedbacks(data) {
  return request({
    url: '/vue-element-admin/feedbacks/update',
    method: 'post',
    data
  })
}

export function deleteFeedbacks(data) {
  return request({
    url: '/vue-element-admin/feedbacks/delete',
    method: 'post',
    data
  })
}

