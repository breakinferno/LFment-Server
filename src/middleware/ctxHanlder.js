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
  try {
    await next()
  } catch (e) {
    console.log('服务器出错了，错误信息是')
    console.log(e)
    // let status = e.status || 500
    // let message = e.message || '服务器错误'
    // let data = e.data || {}

    // if (e instanceof Object) { // 错误是 json 错误
    //   this.body = {
    //     'status': status,
    //     'message': message
    //   }
    //   if (status === 500) {
    //     // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
    //     this.app.emit('error', e, this)
    //   }
    //   return
    // }

    // this.status = status
    // // 根据 status 渲染不同的页面
    // if (status === 403) {
    //   this.body = await this.render('/template/403.html', {
    //     'err': e
    //   })
    // }
    // if (status === 404) {
    //   this.body = await this.render('/template/404.html', {
    //     'err': e
    //   })
    // }
    // if (status === 500) {
    //   this.body = await this.render('/template/500.html', {
    //     'err': e
    //   })
    //   // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
    //   this.app.emit('error', e, this)
    // }
  } finally {
    delete ctx.db
    delete ctx._res
  }
}
