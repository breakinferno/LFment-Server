// const App = require('../models/app')
const DB = require('../tool/db')
const uuid = require('node-uuid').v4

const AddComment = async (ctx) => {
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

const DeleteComment = (ctx) => {
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
  DeleteComment,
  AddComment
}
