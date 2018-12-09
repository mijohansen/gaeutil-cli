const { parseGsUrl, ensureDir, writeJson, fileExists, readJson } = require('../src/utils')
const { pushSecret } = require('../src/apis/secrets')
const path = require('path')
const ignoredPrefixes = ['.', '@', '_']
/**
 * An app need to have access to both the place the
 * secrets are stored and the key to decryptJson them.
 *
 * @param secretFilename
 */
module.exports = function (secretFilename) {
  let gsObj = parseGsUrl(secretFilename)
  let directory = 'secrets' + path.sep + gsObj.bucket
  let filepath = directory + path.sep + gsObj.file
  if (!fileExists(filepath)) {
    ensureDir(directory)
    let initCommand = 'gaeutil secret-init ' + filepath
    console.warn('Sorry man, there is not file at ' + filepath.bold + '. Please initiate one with ' + initCommand.bold)
    return
  }
  let content = readJson(filepath)
  pushSecret(gsObj.bucket, gsObj.file, content).then(function (result) {
    console.log('Secret file is written to ' + secretFilename.bold + '')
    let parts = [
      'https://storage.cloud.google.com',
      gsObj.bucket,
      gsObj.file
    ]
    console.log('Check it out here: ' + parts.join('/'))
  }).catch(function (error) {
    console.error(error)
  })
}

// https://storage.cloud.google.com/beste-adm.appspot.com/test3.json
