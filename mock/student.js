const Mock = require('mockjs')
// mock生成地址库
const generator = require('chinese-address-generator/generator4');
const List = []
const count = 300
// 拓展mockjs
Mock.Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '189'] // 声明电话号码前缀
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) //Number
  }
})
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i + 1,//学生id
    numberId: "202203554211", //学号
    name: "@cname()",//姓名
    idCard: "440111200103078277", //身份证号
    "sex|1": ["男", "女"],// 性别
    parentPhone: "@phone", //监护人电话
    phone: "@phone", //学生手机号码
    address: generator.fabricateFullAddress(), //住址
    avatarUrl: "@image('200x100', '#894FC4', '#FFF', 'png', 'i am a pictrue')", //头像url
    'state|1': ['未实习', '实习中', '已实习'], //学生状态
    classId: "@csentence(5, 8)", //班级id
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/student/list',
    type: 'get',
    response: config => {
      const { numberId, name, state, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (numberId && item.numberId.indexOf(numberId) < 0) return false
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/vue-element-admin/student/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/student/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/student/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

