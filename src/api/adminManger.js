import request from '@/utils/request'

export function fetchAdminManagerList(adminId) {
  return request({
    url: `api/admins_manager/${adminId}/students`,
    method: 'get',
    // params: query
  })
}

