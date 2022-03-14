const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const role = require('./role')
const article = require('./article')
const search = require('./remote-search')
const department = require('./department')
const major = require('./major')
const majorJOb = require('./post')
const cls = require('./cls')
const student = require('./student')
const recruits = require('./recruits')
const enterprise = require('./enterprise')
const feedbacks = require('./feedbacks')
const patrolAdmin = require('./patrolAdmin')
const patrolNormal = require('./patrolNormal')
const induction = require('./induction')
const interview = require('./interview')
const clock = require('./clock')

const mocks = [
  ...user,
  ...role,
  ...article,
  ...search,
  ...department,
  ...major,
  ...majorJOb,
  ...cls,
  ...recruits,
  ...enterprise,
  ...feedbacks,
  ...student,
  ...patrolAdmin,
  ...patrolNormal,
  ...induction,
  ...interview,
  ...clock
]

//正面模拟
//请谨慎使用，它将重新定义XMLHttpRequest，
//这将导致许多第三方库无效（如progress event）。
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function (options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}
