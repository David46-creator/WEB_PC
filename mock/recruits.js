const Mock = require('mockjs')

const List = []
const count = 300

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,
    admin: '@cname()',// 发布人
    phone: '@phone', //发布人联系人电话
    company: '@csentence(6, 8)',//公司
    category: '@csentence(5, 6)',//岗位
    describe: '@cparagraph()',//招聘描述
    salary: '@integer(3000, 7000)',//薪资
    releaseTime: '@date("yyyy-MM-dd")',//发布时间
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/recruits/list',
    type: 'get',
    response: config => {
      const { category, releaseTime, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (category && item.category.indexOf(category) < 0) return false
        if (releaseTime && item.releaseTime.indexOf(releaseTime) < 0) return false
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
    url: '/vue-element-admin/recruits/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/recruits/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/recruits/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

