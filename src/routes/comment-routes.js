const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter()

router.prefix('/api')

router
  .post('/comments', controllers.comments.AddComment)
  .delete('/comments', controllers.comments.DeleteComment)

module.exports = router
