const Mock = require('mockjs')
const List = []
const count = 300

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    name: "@cname()", //反馈人,
    content: "@cparagraph(3)",// 反馈内容
    feedbackPictureUrl: "@image('200x100', '#894FC4', '#FFF', 'png', 'I am a pictrue')" //反馈图片url
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/feedbacks/list',
    type: 'get',
    response: config => {
      const { name, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/vue-element-admin/feedbacks/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/feedbacks/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/feedbacks/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

