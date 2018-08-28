const Get = (ctx) => {
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

const Post = async (ctx) => {
  let data = {
    result: 'post',
    name: ctx.params.name,
    para: ctx.request.body
  }
  ctx.body = {
    code: 200,
    msg: 'mdzz',
    data
  }
}

const Put = (ctx) => {
  let data = {
    result: 'put',
    name: ctx.params.name,
    para: ctx.request.body
  }
  ctx.body = {
    code: 200,
    msg: 'mdzz',
    data
  }
}

const Delete = (ctx) => {
  let data = {
    result: 'delect',
    name: ctx.params.name,
    para: ctx.request.body
  }
  ctx.body = {
    code: 200,
    msg: 'mdzz',
    data
  }
}

module.exports = {
  Get,
  Post,
  Put,
  Delete
}
