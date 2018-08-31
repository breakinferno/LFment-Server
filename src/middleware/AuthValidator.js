/*
 * @Author: luffylv
 * @Description: 授权信息校验
 * @Date: 2018-08-30 15:20:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-31 20:41:26
 */
const NodeRSA = require('node-rsa')

const pubData = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjaJNRiSDrDP1UpvTD1L8LUgnI
6lz52Ez8N0/MaPwXllwIEXwvhjkI3lil4704NyU7JtyCmfRrIeGrNUf4ylZYNuhe
U1FmLI6ai/t0QqMM4AlAGX4tRjdb3/Aga2ye5suy7mT4PXYGgssLmzDqXrRkuAaR
VxqKvc9LaEjP977PywIDAQAB
-----END PUBLIC KEY-----`

const secretKeyData = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAONok1GJIOsM/VSm
9MPUvwtSCcjqXPnYTPw3T8xo/BeWXAgRfC+GOQjeWKXjvTg3JTsm3IKZ9Gsh4as1
R/jKVlg26F5TUWYsjpqL+3RCowzgCUAZfi1GN1vf8CBrbJ7my7LuZPg9dgaCywub
MOpetGS4BpFXGoq9z0toSM/3vs/LAgMBAAECgYAtrnsxfNd1ADX/hE5U7G64KnG2
v4WP1uiYHdBU4p4JavXv1PtaXJ8mbevm3xnKqiE7gbH4Nk8IGlVH3Dsp+hNf4iay
sUrNCE9Hd4s7FpemKxS25GMq2xjl2HoF6PLrcVMef7WStxBBeG9eEkqxm0JoKzZG
HdfhCyaBfOVcc/Vf2QJBAPfZS0itOE9KJdcRROyRKDKvsNGF2evEfA+5Rjhk2SiP
pYOVX3vcB3dFU+DwV+5ChCwaeF0cAfU9NjgbiRq48o8CQQDq4zBdlhMp229hz4NJ
LsFKpZKatZ9wO4OYcnb4MQwwfEPPQ9Vp8RoKl5QIQLDQY3+jOpK98lgcXrv25LMN
Sj0FAkEAkSlDXp2VjVrwLrZ+l8+sq4MbHJw4tk2uG8d3yS/HwGnhlt+1vOVxuflw
1x3tYi6zGuGl/WKaAviG+PWnp28LIQJAcUNQJTCi2QI5OV8JHZbwGgCxKuz9ju8D
y9UWTSPJju+8+wrotAdQ2V6yQTCAklwIRjuOWw2rMzLzTGCHfpcXyQJANFXw98tB
ljtjhHVfH9BnRQdkIvUrDyp4u4OXthN+U3s0gdBjjkkqnvQZYkDs32WISEU6q6Ag
18ljfgZBTQVDxw==
-----END PRIVATE KEY-----`

const testKey = new NodeRSA(pubData, 'pkcs8-public')
const KEY = new NodeRSA()

KEY.importKey(secretKeyData, 'pkcs8')

const enData = testKey.encrypt('12321', 'hex')

console.log('encrypt: ' + enData)

console.log(testKey.exportKey('pkcs8-public'))

console.log(KEY.exportKey('pkcs8'))

const mdzz = testKey.decryptPublic(enData, 'hex')

console.log('same pub decrypt: ' + mdzz)

const deData = KEY.decrypt(enData, 'hex')

console.log('decrypt: ' + deData)

module.exports = () => {
  return async (ctx, next) => {
    const {request} = ctx
    const {header, body, method, query} = request
    const {authorization} = header
    const reqId = header['x-requested-id']
    const timestamp = header['x-requested-time']
    // authorization 信息
    const authInfo = authorization.split('Basic ')[1]
    // 参数信息
    // 签名验证

    // 平台校验

    // 校验是否重放

    console.log('body:\n')
    console.log(body)
    console.log('decrypt: ' + KEY.decrypt(body.content, 'hex'))
    await next()
  }
}
