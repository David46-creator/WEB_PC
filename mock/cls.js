const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    number: 'BJ' + '@integer(10000, 100000)',
    className: '程序设计',
    year: '2021',//班级 级数,
    years: '三年制高技',//学制",
    majorId: '', //专业id,
    homeMajor: '@csentence(5)'// 所属专业
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/cls/list',
    type: 'get',
    response: config => {
      const { number, className, homeMajor, page = 1, limit = 20, sort } = config.query
      let mockList = List.filter(item => {
        if (number && item.number.indexOf(number) < 0) return false
        if (className && item.className.indexOf(className) < 0) return false
        if (homeMajor && item.homeMajor.indexOf(homeMajor) < 0) return false

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
    url: '/vue-element-admin/cls/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/cls/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/cls/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

