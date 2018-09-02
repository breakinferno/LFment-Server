脚手架直接用！
## 数据库设计

数据库的设计的关键在于如何搞笑的对不同数据量的数据进行处理。也就是说关键在于如何处理同一个目标下不同数量级评论。

必要的集合(Collection)： App

```javascript
// 存储app对应的key,secret以及该app评论存储信息
{
  "appkey": "key",
  "appsecret": "secret",
  "collection": "comment2", // 评论数据表名
  "chunk": "chunk3",        // 评论数据片名， 如果有
  "section": "section7"     // 评论数据块名， 如果有
}
```

一个目标下评论的数量级：

    <=1000 简单的一个 单个评论文档没什么多说的

    <=100000 分块处理，一个块100条评论，数据结构如下

    >100000 三级分块 分部分处理，一个部分100块
```javascript
// 基本结构
{
    "id": 1223                  // 评论ID
    "userId":                   // 用户ID
    "targetId":                 // 评论对象ID
    "content":                  // 评论内容
    "createdTime":                     // 评论时间
    "updateTime":
    "extra": {                  // 可选
        "user": {
            "avatar":
            "nickname":
            "email":
            "ip":
        },
        "like":
        "unlike":
        "anouymous":
        "reported":             // 是否被举报  true已经被举报
        "reply": []               // 对于本评论的回复
    }
}
// chunk 100倍
{
    "targetId":
    "userId": 
    "chunkNum":   // 片大小
    "count":      // 当前片的数据量
    "comments":[Comment]
}
// chunk下由于不存在comment，所以回复功能会存在问题
// section 结构
{
    "targetId":
    "userId"
    "sectionNum":
    "count":
    "chuncks": [ChunkId]
}
```

只是简单的记录评论信息即可，其他信息可由第三方App提供。
![数据库概览](https://github.com/breakinferno/LFment-Server/blob/master/db.png)


## 密钥生成

```javascript

// 生成RSA公私秘钥
const RSA = new NodeRSA({b: 1024})
const pubKey = RSA.exportKey('pkcs8-public-pem')
const secretKey = RSA.exportKey('pkcs8-private-pem')
// 当然可以使用openssl生成公私钥
// PS: 这里使用的是pkcs8形式的秘钥

```

## 安全措施

#### 综述

sdk安全措施：对数据进行加密传输的是加密的数据， 然后对原始数据进行签名，将改签名追加到请求中，每个请求生成uuid.v4的唯一id

校验流程：数据项解密 => 根据appkey获取appsecret => 根据appsecret校验签名 => 根据timestamp判断是否超时 => 根据reqId判断是否重复请求 => 讲reqId加入redis并设置过期时间 => 校验通过

#### 加密和签名

<!-- 允许自定义签名算法 -->

数据项: 

```javascript
// 原始的数据项 originData， 服务器私钥加解密，第三方服务公钥加解密
{
  "appkey": AppKey
  "timestamp": Date.now()
  ...data   // 这里是传递的数据
}

// 签名的数据结构 signData
{
  "format": 'json',
  "version": '1.0',
  ... originData // 所有原始数据项
}

// 签名算法
// 简单的对signData按照键名升序进行排序之后排成字符串，然后首尾分别添加‘secret'(字符串) secret(变量值)，最后md5
// 比如signData {key1: val1, key2: val2} 变为   md5('secret' + ’key2‘ + val2 + ’key1‘ + val1 + secret)
```

#### 防重放攻击

防重放攻击： timestamp + requestId + 布隆过滤器(考虑了一下普通的键值对也可以，只不过占用资源比较多)

一个请求过来 => timestamp和现在时间是否小于指定值 => redis是否已经存在reqId => redis加入reqId并且设置过期时间

#### 传输安全

数据传输是否安全： 以后再说 采用https 。。要搞证书等等


## Response

```javascript
// 排序字段 排序顺序（升降序）
{
  code:
  msg:
  data:
}
```
