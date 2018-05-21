const encrypt = require('./googleapis').encryptJson
const decryptJson = require('./googleapis').decryptJson
const getDefaultAuthClient = require('./googleapis').getDefaultAuthClient
const getGcloudAccount = require('./gcloud').getAccount
const {uploadJson,downloadJson} = require('./cloud-storage')
const {forEach, uniq, merge} = require('lodash')

const possibleKeyNameFields = ['@key_name', '_key_name', 'key_name', 'keyName']
const possibleCipherFields = ['_cipher', 'ciphertext']
const allowedOnRoot = ['keyName', 'secretFields', 'attributes', 'created', 'ciphertext']
const ignoredPrefixes = ['.', '@', '_']

const findKeyValue = function (configData) {
  let keyValue = false
  possibleKeyNameFields.forEach(function (keyName) {
    if (configData[keyName]) {
      keyValue = configData[keyName]
    }
  })
  return keyValue
}

const findCipherValue = function (configData) {
  let cipherValue = false
  possibleCipherFields.forEach(function (keyName) {
    if (configData[keyName]) {
      cipherValue = configData[keyName]
    }
  })
  return cipherValue
}

const findSecretFields = function (configFileContent, secretsParsed) {
  let secretFields = []
  if (configFileContent['secretFields']) {
    secretFields = configFileContent['secretFields']
  } else if (configFileContent['secret_fields']) {
    secretFields = configFileContent['secret_fields']
  }
  // legacy support for .secrets
  forEach(secretsParsed, function (elemVal, elemKey) {
    if (elemKey[0] === '.') {
      secretFields.push(elemKey.substring(1))
    }
  })
  forEach(configFileContent, function (elemVal, elemKey) {
    if (elemKey[0] === '.') {
      secretFields.push(elemKey.substring(1))
    }
  })
  return uniq(secretFields)
}

const findAttributes = function (configFileContent, secretsParsed) {
  let attributesIn = (configFileContent.attributes) ? configFileContent.attributes : configFileContent
  let attributesOut = {}
  forEach(attributesIn, function (elemVal, elemKey) {
    if (
      !allowedOnRoot.includes(elemKey) &&
      !ignoredPrefixes.includes(elemKey[0])) {
      attributesOut[elemKey] = elemVal
    }
  })
  forEach(secretsParsed, function (elemVal, elemKey) {
    let trimmedKey = elemKey.replace(/^\.+|\.+$/g, '')
    attributesOut[trimmedKey] = elemVal
  })
  return attributesOut
}

const getConfigData = function (configFileContent) {
  let configData = {
    keyName: findKeyValue(configFileContent)
  }
  forEach(configFileContent, function (elemVal, elemKey) {
    if (allowedOnRoot.includes(elemKey)) {
      configData[elemKey] = elemVal
    }
  })
  return configData
}

const encryptConfig = function (authClient, configFileContent) {
  let keyName = findKeyValue(configFileContent)
  let attributes = findAttributes(configFileContent, [])
  let secretFields = findSecretFields(configFileContent, attributes)
  let secrets = {}
  /**
   * Sorting out the secret fields.
   */
  secretFields.forEach(function (key) {
    secrets[key] = attributes[key]
    attributes[key] = '**secret**'
  })
  return encrypt(authClient, keyName, secrets).then(function (result) {
    let configData = getConfigData(configFileContent)
    configData.created = new Date().toISOString()
    configData.createdBy = getGcloudAccount()
    configData.attributes = attributes
    configData.secretFields = secretFields
    configData = merge(configData, result)
    return configData
  })
}

const pullSecret = function (bucket, file) {
  // grabs the access token from gcloud login
  let authClient = getDefaultAuthClient()
  let keyValue = false
  let cipherValue = false
  let configFileContent = {}
  if (!authClient) {
    console.error('Failed to acquire credentials!'.red.bold)
    return
  }
  return downloadJson(bucket, file).then(function (data) {
    configFileContent = data
    keyValue = findKeyValue(data)
    cipherValue = findCipherValue(data)
    if (!keyValue) {
      console.error('Cant find any keyname in secrets file'.red.bold)
      return false
    }
    if (!cipherValue) {
      console.error('Cant find any cipherValue in secrets file'.red.bold)
      return false
    }
    return decryptJson(authClient, keyValue, cipherValue)
  }).then(function (secretsParsed) {
    let configData = getConfigData(configFileContent)
    configData.secretFields = findSecretFields(configFileContent, secretsParsed)
    configData.attributes = findAttributes(configFileContent, secretsParsed)
    return configData
  })
}
/**
 * @TODO need check for errors
 *
 * @param bucket
 * @param file
 * @param content
 */
const pushSecret = function (bucketName, filename, content) {
  let authClient = getDefaultAuthClient()
  return encryptConfig(authClient, content).then(encryptedConfig => {
    return uploadJson(bucketName, filename, encryptedConfig)
  })
}
module.exports = {
  encryptConfig,
  pullSecret,
  pushSecret
}