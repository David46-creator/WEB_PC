const Mock = require('mockjs')

const List = []
const count = 300

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    post: '@csentence(6, 10)',
    majorid: i + 1,
    homeMajor: '@csentence(5, 5)',
    remarks: '@csentence(6, 12)'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/post/list',
    type: 'get',
    response: config => {
      const { post, homeMajor, remarks, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (post && item.post.indexOf(post) < 0) return false
        if (remarks && item.remarks.indexOf(remarks) < 0) return false
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
    url: '/vue-element-admin/post/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/post/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/post/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

