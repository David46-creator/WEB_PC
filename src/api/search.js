import request from '@/utils/request'

// 通过系名称模糊搜索
export function searchDeptName(deptName) {
  return request({
    url: `api/depts/search?deptName=${deptName}`,
    method: 'get',
  })
}

// 通过专业名，系名模糊查询
export function searchMajors(majorName, deptName) {
  return request({
    url: `api/dept/majors/search?majorName=${majorName}&deptName=${deptName}`,
    method: 'get',
  })
}
