/**
 * @author breakinferno
 * @description ctx,错误code为负数， code为0时成功请求， 大于0时其他情况
 */
const DB = require('../tool/db')
// class Hanlder {
//   constructor (ctx) {
//     this.ctx = ctx
//   }

//   response (code, message, data) {
//     if (typeof message === 'undefined') {
//       this.ctx.body = {
//         ...code
//       }
//       return
//     }
//     if (typeof data === 'undefined') {
//       this.ctx.body = {
//         code,
//         ...message
//       }
//       return
//     }
//     this.ctx.body = {
//       code,
//       message,
//       data
//     }
//   }
// }

module.exports = redis => async (ctx, next) => {
  const {request} = ctx
  const {body, method, query} = request
  // 还原对象
  ctx._data = ['post'].map(m => m.toUpperCase()).includes(method) ? {...body} : {...query}
  // ctx._data = {
  //   params: ctx.params,
  //   query: query,
  //   data: body
  // }
  // const hanlder = new Hanlder(ctx)
  ctx.db = new DB(redis, ctx)
  // ctx._res = hanlder.response.bind(hanlder)
  ctx._res = (data = {}) => {
    return {
      code: data.code || 200,
      message: data.message || '请求成功！',
      data: data.data || null
    }
  }
  ctx._err = (data = {}) => {
    return {
      code: data.code || 500,
      message: data.message || '服务器错误',
      err: {
        status: data.status || 0,
        data: data.data || null
      }
    }
  }
  try {
    await next()
  } catch (e) {
    console.log('服务器出错了，错误信息是')
    console.log(e)
    let code = e.code || 500
    let message = e.message || '服务器错误'
    let data = e.err || {}

    if (e instanceof Error) { // 错误是 json 错误
      ctx.body = {
        'code': code,
        'message': message,
        err: data
      }
      if (code === 500) {
        // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
        ctx.app.emit('error', e, ctx)
      }
      return
    }

    ctx.status = code
    // 根据 status 渲染不同的页面
    if (code === 403) {
      ctx.body = await ctx.render('/template/403.html', {
        'err': e
      })
    }
    if (code === 404) {
      ctx.body = await ctx.render('/template/404.html', {
        'err': e
      })
    }
    if (code === 500) {
      ctx.body = await ctx.render('/template/500.html', {
        'err': e
      })
      // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
      ctx.app.emit('error', e, ctx)
    }
  } finally {
    delete ctx.db
    delete ctx._data
    delete ctx._res
    delete ctx._err
    // 对extra 字段的json字符串进行变化
    if (ctx.body.data) {
      if (Array.isArray(ctx.body.data)) {
        ctx.body.data.map(d => {
          return d.extra && (d.extra = JSON.parse(d.extra))
        })
      } else {
        ctx.body.data.extra = JSON.parse(ctx.body.data.extra)
      }
    }
    // console.log(ctx.body)
    // 应不应该对响应进行加密呢？？？？先不加密了吧。。2333
  }
}
