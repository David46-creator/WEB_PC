import request from '@/utils/request'

export function fetchEnterpriseList(query) {
  return request({
    url: 'api/admin/companies/',
    method: 'get',
    params: query
  })
}

export function createEnterprise(data) {
  return request({
    url: 'api/admin/companies/',
    method: 'post',
    data
  })
}

export function updateEnterprise(data) {
  return request({
    url: 'api/admin/companies/',
    method: 'put',
    data
  })
}

export function deleteEnterprise(companyIds) {
  return request({
    url: `api/admin/companies?companyIds=${companyIds}`,
    method: 'delete',
  })
}

