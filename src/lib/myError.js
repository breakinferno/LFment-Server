module.exports = class MyError {
  constructor (error) {
    this.code = error.code || 500
    this.message = error.message || '服务器错误'
    this.err = {
      status: error.status || 0,
      data: error.data || null
    }
  }
}
