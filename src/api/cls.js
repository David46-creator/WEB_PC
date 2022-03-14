import request from '@/utils/request'

export function fetchClassList(query) {
  return request({
    url: 'api/admins/classes',
    method: 'get',
    params: query
  })
}

// 通过系id，专业id，班级id，管理员id查询 班级总人数，学生的状态数量
export function fetchClassInfoListById(query) {
  return request({
    url: 'api/data-report/class_info',
    method: 'get',
    params: 'query'
  })
}

// 通过系id，专业id，班级id 查询班级指导老师
export function fetchClassInstructorListById(query) {
  return request({
    url: 'api/data-report/class_instructor',
    method: 'get',
    params: query
  })
}

// 通过班级id查询该班级下所有学生
export function fetchStudentByClassId(classId) {
  return request({
    url: `api/students_manager/?classId=${classId}`,
    method: 'get',
    // params: query
  })
}

export function createClass(data) {
  return request({
    url: 'api/dept/major/class',
    method: 'post',
    data
  })
}

export function updateClass(data) {
  return request({
    url: 'api/dept/major/class',
    method: 'put',
    data
  })
}

export function deleteClass(classIds) {
  return request({
    url: `api/dept/major/class?classIds=${classIds}`,
    method: 'delete',
  })
}

