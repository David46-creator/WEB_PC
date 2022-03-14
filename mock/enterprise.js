const Mock = require('mockjs')
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
    id: i + 1,
    name: "@csentence(6, 10)",//企业名称
    address: generator.fabricateFullAddress(), //企业地址
    contactName: "@cname()", //企业联系人"
    phone: '@phone', //联系人电话
    landline: "5533438",//企业固定电话
    companyLogoUrl: "@image('200x100', '#894FC4', '#FFF', 'png', '我是一张图片')",//企业logo url
    srcList: "@image('200x100', '#894FC4', '#FFF', 'png', '我是一张预览图')",//企业logo url
    describe: "@cparagraph(5)", //企业描述
    position: `117.5877,39.7604` //企业经纬度
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/enterprise/list',
    type: 'get',
    response: config => {
      const { name, contactName, phone, page = 1, limit = 50, sort } = config.query
      let mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        if (contactName && item.contactName.indexOf(contactName) < 0) return false
        if (phone && item.phone.indexOf(phone) < 0) return false
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
    url: '/vue-element-admin/enterprise/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/enterprise/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/enterprise/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

