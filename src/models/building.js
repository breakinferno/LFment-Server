const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BuildingSchema = new Schema({
  // 占据者
  holder: String
})

module.exports = mongoose.model('building', BuildingSchema, 'buildings')
