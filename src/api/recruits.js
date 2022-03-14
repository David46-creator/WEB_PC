import request from '@/utils/request'

export function fetchRecruitsList(query) {
  return request({
    url: '/api/recruits/',
    method: 'get',
    params: query
  })
}

// 根据企业id查询该企业下招聘详情
export function fetchRecruitsByEnterpriseIdList(companyId) {
  return request({
    url: `api/admin/companies/${companyId}/recruits`,
    method: 'get',
    // params: query
  })
}

export function createRecruits(data) {
  return request({
    url: 'api/recruits/',
    method: 'post',
    data
  })
}

export function updateRecruits(data) {
  return request({
    url: 'api/recruits/',
    method: 'put',
  })
}

export function deleteRecruits(recruitIds) {
  return request({
    url: `/api/recruits?recruitIds=${recruitIds}`,
    method: 'delete',
  })
}

