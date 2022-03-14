import request from '@/utils/request'

// 调岗记录
export function fetchOfficesHistoryList(studentId) {
  return request({
    url: `api/students_manager/${studentId}/offices/history`,
    method: 'get',
  })
}

// 就职信息
export function fetchOfficesList(studentId) {
  return request({
    url: `api/students_manager/${studentId}/offices`,
    method: 'get',
  })
}

// 就职信息
export function fetchInterviewsList(studentId) {
  return request({
    url: `api/students_manager/${studentId}/interviews/history`,
    method: 'get',
  })
}

export function createOffices(data) {
  return request({
    url: 'api/students_manager/offices',
    method: 'post',
    data
  })
}

export function updateOffices(data) {
  return request({
    url: 'api/students_manager/offices',
    method: 'put',
    data
  })
}

export function deleteOffices(attendanceIds) {
  return request({
    url: `api/students_manager/attendances?attendanceIds=${attendanceIds}`,
    method: 'delete'
  })
}

