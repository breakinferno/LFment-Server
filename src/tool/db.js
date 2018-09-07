/**
 * @author breakinferno
 * @description 统一redis和mongo, redis取不到到mongo取, 单例
 */
const path = require('path')
const App = require(path.join(__dirname, '../models/app'))
const CommentHelper = require(path.join(__dirname, '../models/comment'))
const Codes = require('../constant/responseCodes')
const REDIS_EXPIRE_TIME = require('../config').Redis.expire_time
const dima = async (promise) => {
  return promise.then(res => [null, res]).catch(err => [err])
}

class UniverseDB {
  constructor (iRedis, ctx) {
    if (UniverseDB.instance !== null) {
      return UniverseDB.instance
    }
    this.ctx = ctx
    this.redis = iRedis
    UniverseDB.instance = this
  }

  // key-value get
  get (key) {

  }

  set (key, value) {

  }

  //
  getComments () {

  }

  setComments () {

  }

  /**
   * 由于redis不能设置set或者hash的field的过期时间，只有key级别的有过期时间
   * 这里使用zset来近似实现该功能
   * 每次查找请求的时候都zremrangebyscore来移除过期的请求对象
   * 不存在该reqId的时候存入redis
   */
  async getReqInfo (reqId, timestamp) {
    const startTime = +timestamp - REDIS_EXPIRE_TIME
    const endTime = +timestamp
    let [err, res] = await this.redis.zcard('Reqs')
    if (err) {
      console.log(`redis 删除key为Reqs在[${startTime}--${endTime}]时间的zset时出错！`)
      throw new Error(err)
    }
    // 不存在值
    if (res) {
      // 删除过期值
      [err, res] = await this.redis.zExpire('Reqs', '-inf', startTime)
      if (err) {
        console.log(`redis 删除key为Reqs在[${startTime}--${endTime}]时间的zset时出错！`)
        throw new Error(err)
      }
      // 检查是否存在该值
      [err, res] = await this.redis.zget('Reqs', reqId)
      if (err) {
        console.log(`redis 删除key为Reqs在[${startTime}--${endTime}]时间的zset时出错！`)
        throw new Error(err)
      }
      if (res) {
        console.log(`redis key为Reqs的zset中最近${REDIS_EXPIRE_TIME}ms已存在该值`)
        return this.ctx._res(Codes.REDIS_CODES.duplicate_req)
      }
    }
    // 加入该值
    [err, res] = await this.redis.zadd('Reqs', endTime, reqId)
    if (err) {
      console.log(`redis key为Reqs的zset中添加score为${endTime},member为${reqId}的操作失败!`)
      throw new Error(err)
    }
    console.log(`加入新的reqId啦！reqId 是 ${reqId}, timestamp 是 ${endTime}`)
  }

  /**
   * 统一的获取数据 Apps使用redis和mongo, 评论现在只使用mongo处理
   * @param {string} key hash键名和mongo集合名(collection)
   * @param {string} field hash域名和mongoid名
   */
  async getAppInfo (key, field) {
    let res
    if (typeof field === 'undefined') {
      field = key
      key = 'Apps'
    }
    let [err, value] = await this.redis.hGetRedisAsync(key, field)
    if (err) {
      console.log('redis获取值出错！ key is: ' + key + ' , field is :' + field)
      throw new Error(err)
    }
    // 不存在值, mongo查找，并缓存
    if (!value) {
      [err, value] = await dima(App.findOne().where('appKey').equals(field).exec())
      if (err) {
        console.log('mongodb获取值出错！ appKey is: ' + key)
        throw new Error(err)
      }
      if (!value) {
        console.log('数据库不存在该key对应的值，请检查key是否正确！')
        return this.ctx._res(Codes.MONGO_CODES.not_exist_key)
      }
      // redis缓存
      [err, res] = await this.redis.hSetRedisAsync(key, field, value)
      if (err) {
        console.log('redis缓存出错！key is: ' + key + ' , field is: ' + field)
        throw new Error(err)
      }
    }
    console.log('DB get data success! key is: ' + key + ', result is: ' + value)
    return value
  }

  /**
   * redis为hash的设置值
   * @param {string} key key
   * @param {string} field 域
   */
  async addApp (key, field, value) {
    if (typeof value === 'undefined') {
      value = field
      field = key
      key = 'Apps'
    }
    const helper = CommentHelper()
    const Comment = helper.getModel()
    const name = helper.getName()
    // 创建App表
    let data = {
      appKey: field,
      appSecret: value,
      commentsName: name
    }
    let [err, res] = await dima(new App(data).save())
    if (err) {
      console.log('mongo创建app文档出错！数据为：')
      console.log(data)
      throw new Error(err)
    }
    if (!res) {
      return ctx._res(Codes.MONGO_CODES.)
    }
    // 创建对应的Commen表
    let defaultComment = {
      userId: '',
      targetId: '',
      content: '',
      createdTime: 0,
      updatedTime: 0,
      extra: {}
    };
    [err, res] = await dima(new Comment(defaultComment).save())
    if (err) {
      console.log('mongo创建Comment文档出错！')
      throw new Error(err)
    }
    [err, res] = await dima(Comment.findByIdAndRemove(res._id).exec())
    if (err) {
      console.log('mongo清除Comment文档出错')
      throw new Error(err)
    }
    // 加入redis
    [err, res] = await this.redis.registerApp(field, value)
    if (err) {
      throw new Error('Redis 插入hash失败： key==>' + field + ', value==>' + value)
    }
    return data
  }

  /**
   * 删除app
   * @param {string} appkey appkey
   */
  async deleteApp (appkey) {
    // 删除mongo数据
    let [err, res] = await dima(App.findOneAndDelete({appKey: appkey}).exec())
    if (err) {
      console.log('mongo清除App文档出错！')
      throw new Error(err)
    }
    // 删除redis数据
    [err, res] = await this.redis.expireApp(appkey)
    if (err) {
      console.log('redis清除Apps数据出错')
      throw new Error(err)
    }
  }
}

UniverseDB.instance = null

module.exports = UniverseDB
