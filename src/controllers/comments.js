// const App = require('../models/app')
const AddComment = async (ctx) => {
  console.log(ctx._data)
  const app = ctx._data.appkey
  const data = {...ctx._data}
  delete data.appkey
  ctx.body = ctx._res(await ctx.db.addComment(app, data))
}

const DeleteComment = async (ctx) => {
  const app = ctx._data.appkey
  const data = {...ctx._data}
  delete data.appkey
  ctx.body = ctx._res(await ctx.db.deleteComment(app, data))
}

const GetComment = async (ctx) => {
  const app = ctx._data.appkey
  const data = {...ctx._data}
  delete data.appkey
  ctx.body = ctx._res(await ctx.db.getComment(app, data))
}

const UpdateExtra = async (ctx) => {
  const app = ctx._data.appkey
  const data = {...ctx._data}
  delete data.appkey
  ctx.body = ctx._res(await ctx.db.updateComment(app, data))
}

const SetExtra = async (ctx) => {
  const app = ctx._data.appkey
  const data = {...ctx._data}
  delete data.appkey
  ctx.body = ctx._res(await ctx.db.setExtra(app, data))
}

module.exports = {
  DeleteComment,
  AddComment,
  GetComment,
  UpdateExtra,
  SetExtra
}
