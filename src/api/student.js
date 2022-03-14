import request from '@/utils/request'

export function fetchStudentList(query) {
  return request({
    url: 'api/admins/students',
    method: 'get',
    params: query
  })
}

export function createStudent(data) {
  return request({
    url: 'api/students_manager/batch',
    method: 'post',
    data
  })
}

export function updateStudent(data) {
  return request({
    url: 'api/students_manager/',
    method: 'put',
    data
  })
}

export function deleteStudent(studentIds) {
  return request({
    url: `api/students_manager/batch?studentIds=${studentIds}`,
    method: 'delete'
  })
}

