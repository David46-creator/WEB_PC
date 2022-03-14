import request from '@/utils/request'

export function updateProfile(data) {
  return request({
    url: 'api/admins/profile',
    method: 'put',
    data
  })
}

export function uploadImg(){
  return request({
    url: 'upload/img',
    method: 'post',
    data
  })
}


