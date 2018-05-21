const fs = require('fs')
const jsonfile = require('jsonfile')
const url = require('url')
const path = require('path')

const fileExists = function (filePath) {
  try {
    return fs.statSync(filePath).isFile()
  }
  catch (err) {
    return false
  }
}
const dirExists = function (dir) {
  try {
    return fs.statSync(dir).isDirectory()
  }
  catch (err) {
    return false
  }
}

function ensureDir (targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      fs.mkdirSync(curDir)
      console.log(`Directory ${curDir} created!`)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }
    return curDir
  }, initDir)
}

const readJson = function (filename) {
  try {
    return jsonfile.readFileSync(filename)
  } catch (e) {
    return
  }
}

const writeJson = function (filename, content) {
  try {
    return jsonfile.writeFileSync(filename, content, {
      spaces: 2,
      EOL: '\r\n'
    })
  } catch (e) {
    console.error(e.message)
    return
  }
}
const parseGsUrl = function (gsUrl) {
  let parts = url.parse(gsUrl)
  return {
    bucket: parts.hostname,
    file: parts.path.substring(1)
  }
}

module.exports = {
  readJson,
  parseGsUrl,
  fileExists,
  dirExists,
  ensureDir,
  writeJson
}