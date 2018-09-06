// mongodb 301 - 400
const MONGO_CODES = {
  not_exist_key: {
    code: 301,
    message: '数据库不存在该key对应的值，请检查key是否正确！',
    data: {}
  }
}
// redis 201 - 300
const REDIS_CODES = {
  duplicate_req: {
    code: 201,
    message: '重复的请求',
    data: {}
  }
}
// 安全方面 101 - 200
const SAFE_CODES = {
  param_decrypt: {
    code: 101,
    message: '无法对参数进行解密，请确保已经正确的进行加密',
    data: {}
  },
  sig_verify_fail: {
    code: 102,
    message: '签名错误，数据可能被篡改，请检查！',
    data: {}
  },
  expire_invalid: {
    code: 103,
    message: '过期时间失效',
    data: {}
  }
}
// 通常情况 1-100
const ORD_CODES = {

}

module.exports = {
  SAFE_CODES,
  REDIS_CODES,
  MONGO_CODES,
  ORD_CODES
}
