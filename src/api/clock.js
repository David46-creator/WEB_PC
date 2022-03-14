import request from '@/utils/request'

export function fetchClockList(studentId) {
  return request({
    url: `api/students_manager/${studentId}/attendances/history`,
    method: 'get',
  })
}

export function createClock(data) {
  return request({
    url: 'api/students_manager/attendances',
    method: 'post',
    data
  })
}

export function updateClock(data) {
  return request({
    url: 'api/students_manager/attendances',
    method: 'post',
    data
  })
}

export function deleteClock(attendanceIds) {
  return request({
    url: `api/students_manager/attendances?attendanceIds=${attendanceIds}`,
    method: 'delete'
  })
}

