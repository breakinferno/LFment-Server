const mongoose = require('mongoose')
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

module.exports = function () {
  return {
    name: `Comment${Date.now()}`,
    getModel: function () {
      if (!schemaInstance) {
        schemaInstance = CommentSchema
      }
      return mongoose.model(this.name, schemaInstance, this.name)
    },
    getName: function () {
      return this.name
    }
  }
}
