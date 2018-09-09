/*
 * @Author: luffylv
 * @Description: 授权信息校验
 * @Date: 2018-08-30 15:20:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-09 12:18:40
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

const secretKeyData = fs.readFileSync(path.join(__dirname, '../../cert/pkcs8_rsa_private_key.pem'))

const sKEY = new NodeRSA(secretKeyData, 'pkcs8-private-pem')

module.exports = () => {
  return async (ctx, next) => {
    console.log('start validate')
    if (ctx.url && ctx.url.startsWith('/api')) {
      const nowDate = +Date.now()
      const {request} = ctx
      const {header, body, method, query} = request
      const reqId = header['x-requested-id']
      // 还原对象
      const data = ['post'].map(m => m.toUpperCase()).includes(method) ? {...body} : {...query}
      const signature = data.signature
      delete data.signature
      // 数据解密
      try {
        for (let key of Object.keys(data)) {
          data[key] = sKEY.decrypt(data[key], 'utf-8')
        }
      } catch (err) {
        throw ctx._res(Codes.SAFE_CODES.param_decrypt)
      }
      // 一些关键信息的获取
      const timestamp = +data.timestamp
      const Appkey = data.appkey
      // 获取AppSecret
      const AppSecret = await ctx.db.getAppInfo(Appkey)
      console.log(`appkey是 ${Appkey}, appsecret 是 : ${AppSecret}`)
      // 参数信息
      // 签名验证
      const rSig = verifier(data, signature, AppSecret)
      console.log('veryfier result is: ' + rSig)
      if (!rSig) {
        throw ctx._res(Codes.SAFE_CODES.sig_verify_fail)
      }
      // 校验是否超时
      if (nowDate - timestamp > MAX_EXPIRE_TIME) {
        throw ctx._res({
          ...Codes.SAFE_CODES.expire_invalid,
          message: '请求时间失效，只支持' + time(MAX_EXPIRE_TIME) + '内发起的请求'
        })
      }
      // 检验是否重复请求
      await ctx.db.getReqInfo(reqId, timestamp)
      // const rReqRet = await Redis.setRedisAsync(reqId, value, MAX_EXPIRE_TIME, )
    }
    await next()
    // 校验结果
  }
}
