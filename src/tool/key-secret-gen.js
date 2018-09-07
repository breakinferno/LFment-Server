/**
 * @author breakinerno
 * @description 生成appkey，和appsecret
 */
const crypto = require('crypto')
const uuid = require('node-uuid').v4

module.exports = (params) => {
  const md5Key = crypto.createHash('md5')
  const md5Secret = crypto.createHash('md5')
  const keyStr = `key_${params}_${uuid()}_${params}_key`
  const secretStr = `secret_${params}_${uuid()}_${params}_secret`
  return {
    appkey: md5Key.update(keyStr).digest('base64'),
    appsecret: md5Secret.update(secretStr).digest('base64')
  }
}
