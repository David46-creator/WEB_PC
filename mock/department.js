const Mock = require('mockjs')

const List = []
const count = 300

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    number: 'YX' + '@integer(10000, 100000)',
    facultyName: '信息工程系',
    remarks: '无'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/department/list',
    type: 'get',
    response: config => {
      const { facultyName, number, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (number && item.number.indexOf(number) < 0) return false
        if (facultyName && item.facultyName.indexOf(facultyName) < 0) return false
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
    url: '/vue-element-admin/department/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/department/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/department/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

