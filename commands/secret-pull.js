const {parseGsUrl, ensureDir, writeJson} = require('../src/utils')
const {pullSecret} = require('../src/apis/secrets')
const ignoredPrefixes = ['.', '@', '_']
/**
 * An app need to have access to both the place the
 * secrets are stored and the key to decryptJson them.
 *
 * @param filename
 * @param bucket
 * @param keyProject
 */
module.exports = function (secretFilename) {
  let gsObj = parseGsUrl(secretFilename)
  let directory = 'secrets/' + gsObj.bucket
  let filepath = directory + '/' + gsObj.file
  pullSecret(gsObj.bucket, gsObj.file).then(function (data) {
    ensureDir(directory)
    writeJson(filepath, data)
  }).catch(function (error) {
    console.error(error)
  })
}