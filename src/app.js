const Koa2 = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static2')
const cors = require('koa2-cors')
const SystemConfig = require('./config').System
const DBConfig = require('./config').DB

const path = require('path')
const routes = require('./routes/index')
const ErrorRoutesCatch = require('./middleware/ErrorRoutesCatch')
const ErrorRoutes = require('./routes/error-routes')

const customizedLogger = require('./tool/customized-winston-logger')
const mongoose = require('mongoose')
// import PluginLoader from './lib/PluginLoader'

let applications

global.logger = customizedLogger

mongoose.connect(DBConfig.url, {
  useMongoClient: true
})
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + DBConfig.url)
})
mongoose.connection.on('error', console.error)

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

app
  .use(cors({
    origin: function (ctx) {
      if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
        return '*'
      } else {
        return SystemConfig.HTTP_server_host
      }
    },
    allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept'],
    allowMethods: ['PUT, POST, GET, DELETE, OPTIONS, PATCH'],
    credentials: true
  }))
  .use(ErrorRoutesCatch())
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  // 检查请求是否合法
  .use(async (ctx, next) => {
    if (!applications) {
      // 从数据库获取applications

    }
    // 校验是否正确
    console.log('authorization: ', 'fail')
    return next()
  })
  .use(KoaBody({
    multipart: true,
    strict: false,
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmp'),
      maxFileSize: 100 * 1024 * 1024
    },
    jsonLimit: '100mb',
    formLimit: '10mb',
    textLimit: '10mb'
  }))
  .use(routes)
  .use(ErrorRoutes())
app.listen(SystemConfig.API_server_port)

process.on('uncaughtException', function (err) {
  // 打印出错误
  console.log('unhandlerr:' + err)
  // 打印出错误的调用栈方便调试
  console.log(err.stack)
})
console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

module.exports = app
