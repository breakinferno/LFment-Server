// const App = require('../models/app')
const DB = require('../tool/db')
const uuid = require('node-uuid').v4

// 注册app
const Register = async (ctx) => {
  // type = ctx.params.type
  // if (!type) {
  //   ctx.response.status = 422
  //   ctx.body = {
  //     err: 'No Post Param'
  //   }
  //   return
  // }
  // try {
  //   data = ctx.request.body
  // } catch (e) {
  //   handleError(e)
  // }
  const app = await DB.addApp('key'+uuid(), 'secret')
  ctx.body = app
}

// 删除app
const Delete = (ctx) => {
  let data = {
    result: 'get',
    name: ctx.params.name,
    para: ctx.query
  }
  ctx.body = {
    code: 200,
    msg: 'mdzz',
    data
  }
}

module.exports = {
  Register,
  Delete
}
