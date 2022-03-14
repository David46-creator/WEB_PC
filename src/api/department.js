import request from '@/utils/request'

export function fetchDeptList(query) {
  return request({
    url: '/api/depts/',
    method: 'get',
    params: query
  })
}

export function createDepartment(data) {
  return request({
    url: '/api/dept/',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/api/dept/',
    method: 'put',
    data
  })
}

export function deleteDepartment(deptIds) {
  return request({
    url: `api/dept?deptIds=${deptIds}`,
    method: 'delete',
  })
}

