const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter()

router
  .post('/app', controllers.app.Register)
  .delete('/app', controllers.app.Delete)

module.exports = router
