import request from '@/utils/request'

export function fetchPostList(query) {
  return request({
    url: 'api/dept/major/all-job-categories',
    method: 'get',
    params: query
  })
}

// 获取岗位所就业学生人数数据
export function fetchPostStudentChosenList(query) {
  return request({
    url: `api/dept/major/job-category/students`,
    method: 'get',
    params: query
  })
}

// 根据岗位查询选择该岗位下的学生
export function fetchPostStudentChosenById(jobCategoryId) {
  return request({
    url: `api/students_manager/?jobCategoryId=${jobCategoryId}`,
    method: 'get',
    // params: query
  })
}

export function createPost(data) {
  return request({
    url: 'api/dept/job-categories',
    method: 'post',
    data
  })
}

export function updatePost(data) {
  return request({
    url: 'api/dept/job-categories',
    method: 'put',
    data
  })
}

export function deletePost(jobCategoryIds) {
  return request({
    url: `api/dept/job-categories?jobCategoryIds=${jobCategoryIds}`,
    method: 'delete',
  })
}

