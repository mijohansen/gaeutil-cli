const googleapis = require('googleapis').google
const gcloud = require('./gcloud')

const getDefaultAuthClient = function () {
  let access_token = gcloud.getAccessToken()
  if (!access_token) {
    return
  }
  let authClient = new googleapis.auth.OAuth2()
  authClient.setCredentials({
    access_token: access_token
  })
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    authClient = authClient.createScoped([
      'https://www.googleapis.com/auth/cloud-platform'
    ])
  }
  return authClient
}

const getCryptoKeys = function (authClient, projectId) {
// Lists key rings
  let keycalls = []
  let cryptoKeys = []

  return new Promise(function (resolveMain, rejectMain) {
    const cloudkms = googleapis.cloudkms({
      version: 'v1',
      auth: authClient
    })
    const request = {
      parent: 'projects/' + projectId + '/locations/global'
    }
    cloudkms.projects.locations.keyRings.list(request, (err, result) => {
      if (err) {
        console.error(err)
        return rejectMain(err)
      }
      const keyRings = result.data.keyRings || []
      if (!keyRings.length) {
        console.error('No key rings found.'.red.bold)
        return rejectMain('No key rings found.')
      }
      keyRings.forEach(function (keyRing) {
        keycalls.push(new Promise(function (resolve, reject) {
          cloudkms.projects.locations.keyRings.cryptoKeys.list({
            parent: keyRing.name
          }, function (err, subResult) {
            subResult.data.cryptoKeys.forEach(function (cryptoKey) {
              cryptoKeys.push(cryptoKey.name)
            })
            resolve()
          })
        }))
      })
      Promise.all(keycalls).then(function () {
        resolveMain(cryptoKeys)
      })
    })
  })
}

const encryptJson = function (authClient, keyName, object) {
  return new Promise(function (resolveMain, rejectMain) {
    const cloudkms = googleapis.cloudkms({
      version: 'v1',
      auth: authClient
    })

    const request = {
      // This will be a path parameter in the request URL
      name: keyName,
      // This will be the request body
      resource: {
        plaintext: Buffer.from(JSON.stringify(object)).toString('base64')
      }
    }
    cloudkms.projects.locations.keyRings.cryptoKeys.encrypt(request, (err, result) => {
      let data = result.data
      data.keyName = keyName
      resolveMain(data)
    })
  })
}

const decryptJson = function (authClient, keyName, ciphertext) {
  return new Promise(function (resolveMain, rejectMain) {
    const cloudkms = googleapis.cloudkms({
      version: 'v1',
      auth: authClient
    })

    const request = {
      // This will be a path parameter in the request URL
      name: keyName,
      // This will be the request body
      resource: {
        ciphertext: ciphertext
      }
    }
    cloudkms.projects.locations.keyRings.cryptoKeys.decrypt(request, (err, result) => {
      if (err) {
        rejectMain(err)
      } else {
        let decoded = Buffer.from(result.data.plaintext, 'base64').toString('ascii')
        let secretsParsed = JSON.parse(decoded)
        resolveMain(secretsParsed)
      }
    })
  })
}

module.exports = {
  getDefaultAuthClient,
  getCryptoKeys,
  encryptJson,
  decryptJson
}
