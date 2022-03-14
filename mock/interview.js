const Mock = require('mockjs')
const List = []
const count = 300
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1, //面试申请id
    studentId: "@cname()", //学生id
    advertiseId: '@cparagraph()', //招聘信息id
    interviewTime: '@date("yyyy-MM-dd")', //面试申请时间
    "state|1": ['准备面试', '面试通过', '面试失败'] //面试状态 0=准备面试，1=面试通过，2=面试失败
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/interview/list',
    type: 'get',
    response: config => {
      const { studentId, interviewTime, state, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (studentId && item.studentId.indexOf(studentId) < 0) return false
        if (interviewTime && item.interviewTime.indexOf(interviewTime) < 0) return false
        if (interviewTime && item.interviewTime.indexOf(interviewTime) < 0) return false
        if (state && item.state.indexOf(state) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/interview/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/interview/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/interview/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

