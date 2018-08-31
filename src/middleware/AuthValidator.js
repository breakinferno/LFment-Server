/*
 * @Author: luffylv
 * @Description: 授权信息校验
 * @Date: 2018-08-30 15:20:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-30 15:39:09
 */

module.exports = () => {
  return async (ctx, next) => {
    const {request} = ctx
    const {header, body, method, query} = request
    const {authorization} = header
    const reqId = header['x-requestd-id']
    // authorization 信息
    const authInfo = authorization.split('Basic ')[1]
    // 参数信息
    // 签名验证

    // 平台校验

    // 校验是否重放

    console.log('failed')
    return next()
  }
}
