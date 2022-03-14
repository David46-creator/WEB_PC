import request from '@/utils/request'

export function fetchMajorList(query) {
  return request({
    url: '/api/dept/all_majors/',
    method: 'get',
    params: query
  })
}

export function fetchDeptListById(deptId) {
  return request({
    url: `api/dept/${deptId}`,
    method: 'get',
  })
}

export function createMajor(data) {
  return request({
    url: '/api/dept/major/',
    method: 'post',
    data
  })
}


export function updateMajor(data) {
  return request({
    url: '/api/dept/major/',
    method: 'put',
    data
  })
}

export function deleteMajor(majorIds) {
  return request({
    url: `/api/dept/major?majorIds=${majorIds}`,
    method: 'delete',
  })
}

