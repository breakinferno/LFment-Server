// mongodb 301 - 400
const MONGO_CODES = {
  not_exist_key: {
    status: 301,
    message: '数据库不存在该key对应的值，请检查key是否正确！',
    data: {}
  },
  not_exist_right_name_app: {
    status: 302,
    message: '找不到collectionName对应的app',
    data: {}
  },
  get_mongo_app_error: {
    status: 303,
    message: '获取app数据时后端数据库报错'
  },
  get_mongo_comment_error: {
    status: 304,
    message: '获取Comment时后端数据库报错'
  },
  add_mongo_app_error: {
    status: 305,
    message: '创建app时后端数据库报错'
  },
  add_mongo_comment_error: {
    status: 306,
    message: '创建评论时后端数据库出错'
  },
  delete_mongo_comment_error: {
    status: 307,
    message: '删除评论时后端数据库出错'
  },
  delete_mongo_app_error: {
    status: 308,
    message: '删除APP时后端数据库出错'
  }
}
// redis 201 - 300
const REDIS_CODES = {
  duplicate_req: {
    status: 201,
    message: '重复的请求'
  },
  get_redis_count_error: {
    status: 202,
    message: '获取请求数目出错'
  },
  delete_redis_error: {
    status: 203,
    message: '删除请求出错'
  },
  get_redis_req_error: {
    status: 204,
    message: '获取该请求时缓存数据库出错'
  },
  add_redis_error: {
    status: 205,
    message: '加入请求时缓存数据库出错'
  },
  get_redis_app_error: {
    status: 206,
    message: '获取app数据时缓存数据库出错'
  },
  add_redis_app_error: {
    status: 207,
    message: '加入app数据时缓存数据库出错'
  },
  delete_redis_app_error: {
    status: 208,
    message: '删除app时缓存数据库出错'
  }
}
// 安全方面 101 - 200
const SAFE_CODES = {
  param_decrypt: {
    status: 101,
    message: '无法对参数进行解密，请确保已经正确的进行加密',
    data: {}
  },
  sig_verify_fail: {
    status: 102,
    message: '签名错误，数据可能被篡改，请检查！',
    data: {}
  },
  expire_invalid: {
    status: 103,
    message: '过期时间失效',
    data: {}
  },
  version_error: {
    status: 104,
    message: '版本错误，请检查版本'
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
