/*
 * @Author: luffylv
 * @Description: 授权信息校验
 * @Date: 2018-08-30 15:20:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-15 11:41:39
 */
const NodeRSA = require('node-rsa')
const fs = require('fs')
const path = require('path')
const LFSDK = require('LFSDK')
const time = require('../tool/time')
const Codes = require('../constant/responseCodes')
const LFUTILS = LFSDK.utils
const {verifier} = LFUTILS
const MAX_EXPIRE_TIME = require('../config').Redis.expire_time
const VERSION = require('../config').System.version
const secretKeyData = fs.readFileSync(path.join(__dirname, '../../cert/pkcs8_rsa_private_key.pem'))

const sKEY = new NodeRSA(secretKeyData, 'pkcs8-private-pem')

function rdecrypt (key, data) {
  if (typeof data === 'object') {
    let rt = {}
    Object.keys(data).forEach(k => {
      rt[k] = rdecrypt(key, data[k])
    })
    return rt
  }
  return key.decrypt(data, 'utf-8')
}

module.exports = () => {
  return async (ctx, next) => {
    console.log('start validate')
    if (ctx.url && ctx.url.startsWith('/api')) {
      const nowDate = +Date.now()
      let data = ctx._data
      const reqId = ctx.request.header['x-requested-id']
      const signature = data.signature
      delete data.signature
      // 数据解密
      try {
        // for (let key of Object.keys(data)) {
        //   data[key] = sKEY.decrypt(data[key], 'utf-8')
        //   data[key] =
        // }
        Object.keys(data).forEach(key => {
          data[key] = rdecrypt(sKEY, data[key])
        })
      } catch (err) {
        throw ctx._err(Codes.SAFE_CODES.param_decrypt)
      }
      // 一些关键信息的获取
      const timestamp = +data.timestamp
      const Appkey = data.appkey
      // 获取AppSecret
      const appInfo = await ctx.db.getAppInfo(Appkey) // 由于commentName也存在里面了
      const AppSecret = appInfo.split('@')[0]
      console.log(`appkey是 ${Appkey}, appsecret 是 : ${AppSecret}`)
      // 参数信息
      // 签名验证
      const rSig = verifier(data, signature, AppSecret)
      console.log('veryfier result is: ' + rSig)
      if (!rSig) {
        throw ctx._err(Codes.SAFE_CODES.sig_verify_fail)
      }
      // 检查版本
      if (data.version !== VERSION) {
        throw ctx._err(Codes.SAFE_CODES.version_error)
      }
      delete data.version
      delete data.format
      // 校验是否超时
      if (nowDate - timestamp > MAX_EXPIRE_TIME) {
        throw ctx._err({
          ...Codes.SAFE_CODES.expire_invalid,
          message: '请求时间失效，只支持' + time(MAX_EXPIRE_TIME) + '内发起的请求'
        })
      }
      delete data.timestamp
      // 检验是否重复请求
      await ctx.db.getReqInfo(reqId, timestamp)
      // const rReqRet = await Redis.setRedisAsync(reqId, value, MAX_EXPIRE_TIME, )
    }
    await next()
    // 校验结果
  }
}
