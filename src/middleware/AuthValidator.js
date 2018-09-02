/*
 * @Author: luffylv
 * @Description: 授权信息校验
 * @Date: 2018-08-30 15:20:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-02 17:15:04
 */
const NodeRSA = require('node-rsa')
const LFSDK = require('LFSDK')
const time = require('../tool/time')
const LFUTILS = LFSDK.utils
const {signer, verifier, encryptData} = LFUTILS
const MAX_EXPIRE_TIME = 3 * 60 * 1000

// const keyGen = new NodeRSA({b: 1024})
// const pubData = keyGen.exportKey('pkcs8-public-pem')
// const pubData = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKIzX+dU/e+xot+qlHoDbweVaW
// MUjGUVCsUTbT/y8ifsNN1NnQ9vCCBGr+vmM+cTqInYVWxM3W2udc0eOD9a33nybF
// o8W7rwKmK1ZgE0nt5eHe1q45knGKNelB8FiDKteVTEGHDVNCGc8nkMvQMSd2AZtj
// Ea0KPY39RCqOWJlIfQIDAQAB
// -----END PUBLIC KEY-----`
// const secretKeyData = keyGen.exportKey('pkcs8-private-pem')
const secretKeyData = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIojNf51T977Gi36
qUegNvB5VpYxSMZRUKxRNtP/LyJ+w03U2dD28IIEav6+Yz5xOoidhVbEzdba51zR
44P1rfefJsWjxbuvAqYrVmATSe3l4d7WrjmScYo16UHwWIMq15VMQYcNU0IZzyeQ
y9AxJ3YBm2MRrQo9jf1EKo5YmUh9AgMBAAECgYBNxdlGdIINhs6MiI36N6f26Dnp
wcG5dlq3SdpWrVu6Tihjj606y21JpncfCc4Sf+l2tUk3OwKxLvoH9lvkFdRltTqu
dJoN9h4MC6LU6X3+rzuWPmsEP6jLFlo2Cjx9bdxcf/QXj9kSyYhAgfwKJMW8HPS/
z44i8fTyC3aEUkkIgQJBAPMnuH++6e/cCu7Ojx+NCczjNDJUoN87A4vEA4+l/tm2
SwcgpADL/oD67ETe7FTj1qAmnUUVHkH5VQ4thoZbG40CQQCRb0wWcDtpc7b2jB0v
YodXYTtpRU4VaCfXYuuP5m3848ZgJ6z5ZxhJFv09tmJHo2AWSItSv3OJoYi5JC0v
GyyxAkBgg2qjIgc/EqswQMLkdhnmvmQwehDkqkrtBh+Xu/6dMdM0AAu42T+quG5h
o85Qn6LILKuOCSTacPoGx6E24SDdAkAnUqiICKCHyrnVv9zESye9AJVHyW1rbFYZ
bq2youNqVUv2A8RJSw7N9GFUplO8evgoDkVdglaDCCInrRhqfDaBAkEAnYEnHEJE
0cmp3zQDEzSfOoGH9gKlWd1ibvKx1w2V1tWs+4mvMuYWHnsGHSkVGGnPxTq8nZs1
yTCUezQ60xrZ7g==
-----END PRIVATE KEY-----`

const sKEY = new NodeRSA(secretKeyData, 'pkcs8-private-pem')

module.exports = (Redis) => {
  return async (ctx, next) => {
    const nowDate = +Date.now()
    const {request} = ctx
    const {header, body, method, query} = request
    const {authorization} = header
    const reqId = header['x-requested-id']
    // authorization 信息
    const authInfo = authorization.split('Basic ')[1]
    // 还原对象
    const data = {...body}
    const signature = data.signature
    delete data.signature
    // 数据解密
    try {
      for (let key of Object.keys(data)) {
        data[key] = sKEY.decrypt(data[key], 'utf-8')
      }
    } catch (err) {
      throw new Error('无法对参数进行解密，请确保已经正确的进行加密')
    }
    // 一些关键信息的获取
    const timestamp = +data.timestamp
    const Appkey = data.appkey
    // 获取AppSecret
    const [err, AppSecret] = await Redis.hGetRedisAsync(Appkey)
    if (err) {
      throw new Error('无法从redis服务器获取对应的appsecret，请检查appkey是否正确！')
    }
    console.log(`appkey是 ${Appkey}, appsecret 是 : ${AppSecret}`)
    // 参数信息
    // 签名验证
    const rSig = verifier(data, signature, AppSecret)
    console.log('veryfier result is: ' + rSig)
    if (!rSig) {
      throw new Error('Access Denied!签名错误，数据可能被篡改！')
    }
    // 校验是否超时
    if (nowDate - timestamp > MAX_EXPIRE_TIME) {
      throw new Error('请求时间失效，只支持' + time(MAX_EXPIRE_TIME) + '内发起的请求')
    }
    // 检验是否重复请求
    const [errReq, rReqId] = await Redis.getRedisAsync(reqId)
    if (errReq) {
      throw new Error('获取reqId出错，' + JSON.stringify(errReq))
    }
    if (rReqId) {
      throw new Error('请求已经使用过了，请不要重复发送该请求！')
    }
    // const rReqRet = await Redis.setRedisAsync(reqId, value, MAX_EXPIRE_TIME, )
    await next()
    // 校验结果
  }
}
