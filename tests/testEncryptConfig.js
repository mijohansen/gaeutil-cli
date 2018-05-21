const encryptConfig = require('../src/apis/secrets').encryptConfig
const authClient = require('../src/apis/googleapis').getDefaultAuthClient()
const confData = {
  'keyName': 'projects/red-operations/locations/global/keyRings/red-operations/cryptoKeys/kaizen-reloaded',
  'secretFields': [
    'token'
  ],
  'attributes': {
    'my-non-secret': 'this is not a secret',
    'token': 'asdfahakk fasldfk asdfk sadfk '
  }
}
const confData2 = {
  '@key_name': 'projects/red-operations/locations/global/keyRings/red-operations/cryptoKeys/kaizen-reloaded',
  'my-non-secret': 'this is not a secret',
  '.token': 'asdfahakk fasldfk asdfk sadfk '
}
encryptConfig(authClient, confData2).then(function (res) {
  console.log(res)
}).catch(function (error) {
  console.error(error)
})
