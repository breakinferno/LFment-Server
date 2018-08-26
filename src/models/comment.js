const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommentSchema = new Schema({
  // 评论
  userId: String,
  targetId: String,
  content: String,
  createdTime: Number,
  updatedTime: Number,
  extra: {} // markModified(extra)
})

module.exports = mongoose.model('comment', CommentSchema, 'comments')
