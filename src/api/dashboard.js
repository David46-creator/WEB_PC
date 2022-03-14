import request from '@/utils/request'

// 首页
export function fetchDashboardList() {
  return request({
    url: 'api/data-report/all_count',
    method: 'get',
    // params: query
  })
}

// 首页
export function fetchChartList() {
  return request({
    url: 'api/data-report/student_info',
    method: 'get',
    // params: query
  })
}

