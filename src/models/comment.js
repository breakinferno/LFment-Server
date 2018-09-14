const mongoose = require('mongoose')
const App = require('./app')
const Schema = mongoose.Schema
let schemaInstance = null

// 如果存储混合类型的话需要每次都手动标记并且存储
// 算了直接存成json字符串，最后返回再转回来就是了
const CommentSchema = new Schema({
  // 评论
  userId: String,
  targetId: String,
  content: String,
  createdTime: Number,
  updatedTime: Number,
  // extra: {} // markModified(extra)
  extra: String
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
          console.log('加载App错误')
          throw new Error({
            status: -1,
            message: '加载App出错'
          })
        }
        // 不存在
        if (!res) {
          throw new Error({
            status: -2,
            message: '不存在App表'
          })
        }
        map = res.reduce((map, app) => {
          const name = app['commentsName']
          map[name] = mongoose.model(name, schemaInstance, name)
          return map
        }, {})
      }
      return map[name]
    },
    getName: function () {
      return this.name
    }
  }
}
