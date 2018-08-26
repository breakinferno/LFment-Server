const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AppSchema = new Schema({
  appKey: String,
  appSecret: String
})

module.exports = mongoose.model('app', AppSchema, 'apps')
