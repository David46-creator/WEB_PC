import request from '@/utils/request'

export function fetchpatrolAdminList(query) {
  return request({
    url: 'api/admins_manager/patrol-records/history',
    method: 'get',
    params: query
  })
}

export function fetchpatrolAdminByIdList(adminId) {
  return request({
    url: `api/admins_manager/${adminId}/patrol-records`,
    method: 'get',
  })
}

