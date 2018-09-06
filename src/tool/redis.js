/**
 * @author breakinfenro
 * @description redis相关操作
 */

const promiseAdapter = (fn, context, ...args) => {
  return new Promise((resolve, reject) => {
    typeof fn === 'function' && fn.call(context, ...args, (err, res) => {
      if (err) {
        return reject(err)
      }
      resolve(res)
    })
  }).then(res => [null, res])
    .catch(err => [err])
}

class Redis {
  constructor (client) {
    this.client = client
  }

  getRedisAsync (key) {
    return promiseAdapter(this.client.get, this.client, key)
  }

  hGetRedisAsync (key, field) {
    return promiseAdapter(this.client.hget, this.client, field ? key : 'Apps', field || key)
  }

  /**
   * hash set 方法
   * @param {string} key hash对象
   * @param {string}} field 键名
   * @param {string} value 减值
   */
  async hSetRedisAsync (key, field, value) {
    return promiseAdapter(this.client.hset, this.client, key, field, value)
  }

  /**
   * 设置键值对
   * @param {string} key 键名
   * @param {string} value 键值
   * @param {number} time 过期时间
   * @param {0 | 1} pre 过期时间单位，0位s,1位ms
   */
  async setRedisAsync (key, value, time = -1, pre = 0) {
    return promiseAdapter(this.client.set, this.client, key, value, 'PEX', pre ? time * 1000 : time)
  }

  /**
   * 注册app时redis缓存
   * @param {string}} appkey appkey
   * @param {string} appsecret appsecret
   */
  async registerApp (appkey, appsecret) {
    if (typeof appsecret === 'undefined') {
      appkey = appkey.Appkey
      appsecret = appkey.AppSecret
    }
    const [err, res] = await this.hSetRedisAsync('Apps', appkey, appsecret)
    if (err) {
      throw new Error('Redis 插入hash失败： key==>' + appkey + ', value==>' + appsecret)
    }
    return res
  }

  /**
   * 将zset某个范围内的key去掉
   * @param {string} key 键值
   * @param {number} min 最小值
   * @param {number}} max 最大值
   */
  async zExpire (key, min, max) {
    return promiseAdapter(this.client.zremrangebyscore, this.client, key, min, max)
  }

  /**
   * 获取zset某个成员的score,没有为null
   * @param {string} key 键名
   * @param {string} member 成员名
   */
  async zget (key, member) {
    return promiseAdapter(this.client.zscore, this.client, key, member)
  }

  /**
   * 添加zset成员
   * @param {string} key 键名
   * @param {number}} score 分值
   * @param {string} member 成员
   */
  async zadd (key, score, member) {
    return promiseAdapter(this.client.zadd, this.client, key, score, member)
  }

  /**
   * 返回集合数目
   * @param {string} key 键名
   */
  async zcard (key) {
    return promiseAdapter(this.client.zcard, this.client, key)
  }
}

module.exports = Redis
