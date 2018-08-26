const compose = require('koa-compose')
const mainRoutes = require('./main-routes')
const userRoutes = require('./user-routes')

const router = compose([
  mainRoutes.routes(),
  mainRoutes.allowedMethods(),
  userRoutes.routes(),
  userRoutes.allowedMethods(),
])

module.exports = router
