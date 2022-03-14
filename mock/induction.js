const Mock = require('mockjs')
const List = []
const count = 300
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1, //就职id
    studentId: "@cname(3)", //学生id
    categoryId: "@csentence(5, 8)", //岗位id
    companyId: "@csentence(5, 8)", //公司id
    officeTime: "@date(yyyy-MM-dd)", //就职时间
    'counterpart|1': ['待分配', '对口', '不对口'] //岗位是否对口 -1=还没操作，0=不对口，1=对口
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/induction/list',
    type: 'get',
    response: config => {
      const { studentId, categoryId, counterpart, officeTime, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (studentId && item.studentId.indexOf(studentId) < 0) return false
        if (categoryId && item.categoryId.indexOf(categoryId) < 0) return false
        // if (counterpart && item.counterpart.indexOf(counterpart) < 0) return false
        if (officeTime && item.officeTime.indexOf(officeTime) < 0) return false
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
    url: '/vue-element-admin/induction/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/induction/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/induction/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

