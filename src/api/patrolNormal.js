import request from '@/utils/request'

export function fetchPatrolNormalList(query) {
  return request({
    url: 'api/admins/patrol-records/history',
    method: 'get',
    params: query
  })
}

export function createPatrolNormal(data) {
  return request({
    url: 'api/admins/patrol-records',
    method: 'post',
    data
  })
}

export function updatePatrolNormal(data) {
  return request({
    url: 'api/admins/patrol-records',
    method: 'put',
    data
  })
}

export function deletePatrolNormal(recordIds) {
  return request({
    url: `api/admins/patrol-records?recordIds=${recordIds}`,
    method: 'delete',
  })
}

