const Mock = require('mockjs')
const generator = require('chinese-address-generator/generator4');
const List = []
const count = 300
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1, //打卡记录id
    studentId: "@cname()", //学生id
    note: "@cparagraph()", //周小结
    address: generator.fabricateFullAddress(),//打卡地址
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/clock/list',
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
    url: '/vue-element-admin/clock/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/clock/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/clock/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

