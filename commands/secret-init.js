const inquirer = require('inquirer')
const { parseGsUrl, ensureDir, writeJson, readJson, fileExists } = require('../src/utils')
const getDefaultAuthClient = require('../src/apis/googleapis').getDefaultAuthClient
const getCryptoKeys = require('../src/apis/googleapis').getCryptoKeys

/**
 * An app need to have access to both the place the
 * secrets are stored and the key to decryptJson them.
 *
 * @param filename
 * @param bucket
 * @param keyProject
 */
module.exports = function (secretFilename, projectId) {
  let gsObj = parseGsUrl(secretFilename)
  let directory = 'secrets/' + gsObj.bucket
  let filepath = directory + '/' + gsObj.file

  // grabs the access token from gcloud login
  let authClient = getDefaultAuthClient()
  if (!authClient) {
    console.error('Failed to acquire credentials!'.red.bold)
    return
  }
  let configContent = {
    secretFields: [],
    attributes: {}
  }
  if (fileExists(filepath)) {
    configContent = readJson(filepath)
  }
  getCryptoKeys(authClient, projectId).then(function (cryptoKeys) {
    return inquirer.prompt([{
      type: 'list',
      name: 'keyName',
      message: 'which key?',
      choices: cryptoKeys
    }]).then(function (result) {
      configContent.keyName = result.keyName
      ensureDir(directory)
      console.log('Secret file ' + filepath.bold + ' initiated.')
      return writeJson(filepath, configContent)
    })
  })
}
