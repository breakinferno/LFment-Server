脚手架直接用！

```javascript

pubkey:openssl rsa -in .key -pubout -outform PEM -out .key.pub

secretKey: ssh-keygen -t rsa -b 1024 .key

footprint: luffy
```

sdk安全措施：对数据进行加密传输的是加密的数据， 然后对原始数据进行签名，将改签名追加到请求中，每个请求生成uuid.v4的唯一id

<!-- 允许自定义签名算法 -->


签名算法：

加密；appkey + timestamp + params + appkey 使用 appkey sha1一遍

防反编译：

防重放攻击： requestId + 布隆过滤器

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
