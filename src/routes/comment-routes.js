const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter()

router.prefix('/api')

router
  .post('/comments', controllers.comments.AddComment)
  .delete('/comments', controllers.comments.DeleteComment)
  .get('/comments', controllers.comments.GetComment)
  .patch('/comments', controllers.comments.UpdateExtra)
  .put('/comments', controllers.comments.SetExtra)

module.exports = router
