const compose = require('koa-compose')
const mainRoutes = require('./main-routes')
const appRoutes = require('./app-routes')
const router = compose([
  mainRoutes.routes(),
  mainRoutes.allowedMethods(),
  appRoutes.routes(),
  appRoutes.allowedMethods()
])

module.exports = router
