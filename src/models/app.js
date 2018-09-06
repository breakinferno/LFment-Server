const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AppSchema = new Schema({
  appKey: String,
  appSecret: String,
  comments: String
})

module.exports = mongoose.model('App', AppSchema, 'Apps')
