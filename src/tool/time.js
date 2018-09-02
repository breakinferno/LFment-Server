/**
 * @author breakinferno
 * @description 时间处理函数，转换时间为xx分xx秒
 */

const transfer = (time) => {
  let ret
  let secPart = Math.round(time / 1000)
  let miniPart = Math.floor(secPart / 60)
  let hPart = Math.floor(miniPart / 60)
  let dPart = Math.floor(hPart / 24)
  
  return ret
}

module.exports = (time, format = 'ms') => {
  let ret
  switch (format) {
  case 'ms':
    ret = transfer(time)
    break
  case 's':
    ret = transfer(time * 1000)
    break
  default:
    ret = transfer(time)
  }
  return ret
}
