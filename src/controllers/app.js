// const App = require('../models/app')
const keyAndSecret = require('../tool/key-secret-gen')
// 注册app
const Register = async (ctx) => {
  const {request} = ctx
  const {body} = request
  const pair = keyAndSecret(JSON.stringify(body))
  const app = await ctx.db.addApp(pair.appkey, pair.appsecret)
  delete app.comments
  ctx.body = app
}

// 删除app
const Delete = async (ctx) => {
  const {request} = ctx
  const {query} = request
  await ctx.db.deleteApp(query.appKey)
  ctx.body = {
    status: 0,
    message: '已删除appkey:' + query.appKey,
    data: {}
  }
}

module.exports = {
  Register,
  Delete
}
