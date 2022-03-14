const Mock = require('mockjs')

const List = []
const count = 300

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    adminId: "", //管理员id,
    studentId: "@cname()", //学生id
    record: "@cparagraph()", //文字记录
    companyName: "@csentence(6, 8)", //公司名称
    patrolTime: "@date(yyyy-MM-dd)" //巡查时间
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/patrolNormal/list',
    type: 'get',
    response: config => {
      const { studentId, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (studentId && item.studentId.indexOf(studentId) < 0) return false
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
    url: '/vue-element-admin/patrolNormal/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/patrolNormal/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/patrolNormal/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

