const NodeRSA = require('node-rsa')
const keyGen = new NodeRSA({b: 1024})
const pubData = keyGen.exportKey('pkcs8-public-pem')
// const pubData = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKIzX+dU/e+xot+qlHoDbweVaW
// MUjGUVCsUTbT/y8ifsNN1NnQ9vCCBGr+vmM+cTqInYVWxM3W2udc0eOD9a33nybF
// o8W7rwKmK1ZgE0nt5eHe1q45knGKNelB8FiDKteVTEGHDVNCGc8nkMvQMSd2AZtj
// Ea0KPY39RCqOWJlIfQIDAQAB
// -----END PUBLIC KEY-----`
const secretKeyData = keyGen.exportKey('pkcs8-private-pem')

console.log('pubdata is: ' + pubData)
console.log('secretData is: ' + secretKeyData)
