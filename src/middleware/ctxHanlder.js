/**
 * @author breakinferno
 * @description ctx,错误code为负数， code为0时成功请求， 大于0时其他情况
 */
const DB = require('../tool/db')
class Hanlder {
  constructor (ctx) {
    this.ctx = ctx
  }

  response (code, message, data) {
    if (typeof message === 'undefined') {
      this.ctx.body = {
        ...code
      }
      return
    }
    if (typeof data === 'undefined') {
      this.ctx.body = {
        code,
        ...message
      }
      return
    }
    this.ctx.body = {
      code,
      message,
      data
    }
  }
}

module.exports = redis => async (ctx, next) => {
  const hanlder = new Hanlder(ctx)
  ctx.db = new DB(redis, ctx)
  ctx._res = hanlder.response.bind(hanlder)
  await next()
  delete ctx.db
  delete ctx._res
}
