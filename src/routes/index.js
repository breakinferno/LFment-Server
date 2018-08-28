const compose = require('koa-compose')
const mainRoutes = require('./main-routes')
const router = compose([
  mainRoutes.routes(),
  mainRoutes.allowedMethods()
])

module.exports = router
