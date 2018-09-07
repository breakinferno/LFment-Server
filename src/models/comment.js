const mongoose = require('mongoose')
const App = require('./app')
const Schema = mongoose.Schema
let schemaInstance = null
const CommentSchema = new Schema({
  // 评论
  userId: String,
  targetId: String,
  content: String,
  createdTime: Number,
  updatedTime: Number,
  extra: {} // markModified(extra)
})

let map = null

// 动态创建collection, 如何保存model到数据库呢？？？？
module.exports = function () {
  return {
    name: `Comment${Date.now()}`,
    /**
     * 1.获取model，如果name为空，则创建一个model实例，否则在已有实例中查找该model
     * 2.每次查找判断map是否为空，为空加载model
     */
    getModel: async function (name) {
      if (!schemaInstance) {
        schemaInstance = CommentSchema
      }
      let model
      // 新建model
      if (!name) {
        model = mongoose.model(this.name, schemaInstance, this.name)
        map = {
          ...map,
          [name]: model
        }
        return model
      }
      // 是否需要加载map
      if (!map) {
        let [err, res] = await App.find().exec().then(res => [null, res]).catch(err => [err])
        if (err) {
          console.log('加载App')
        }
        // 不存在
        if (!res) {
          return null
        }
        map = res.reduce((map, app) => {
          const name = app['commentsName']
          map[name] = mongoose.model(name, schemaInstance, name)
          return map
        }, {})
      }
      return model[name]
    },
    getName: function () {
      return this.name
    }
  }
}
