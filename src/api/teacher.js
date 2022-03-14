import request from '@/utils/request'

export function fetchTeachersList(query) {
  return request({
    url: 'api/admins_manager/',
    method: 'get',
    params: query
  })
}

export function fetchOperateRecordHistoryList(adminId, query) {
  return request({
    url: `api/admins_manager/${adminId}/operate_record/history`,
    method: 'get',
    params: query
  })
}

// 查看该教师下管理的所有班级
export function fetchClassByTeacherIdList(adminId, query) {
  return request({
    url: `api/admins_manager/${adminId}/classes`,
    method: 'get',
    params: query
  })
}


export function createTeachers(data) {
  return request({
    url: 'api/admins_manager',
    method: 'post',
    data
  })
}

export function updateTeachers(data) {
  return request({
    url: 'api/admins_manager/',
    method: 'put',
    data
  })
}

export function deleteTeachers(adminIds) {
  return request({
    url: `api/admins_manager/batch?adminIds=${adminIds}`,
    method: 'delete',
  })
}

