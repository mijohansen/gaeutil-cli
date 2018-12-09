const { fileExists } = require('../utils')
const filename = '.idea/workspace.xml'
const fs = require('fs')
const exists = function () {
  return fileExists(filename)
}
const read = function () {
  return fs.readFileSync(filename).toString()
}
const write = function (content) {
  return fs.writeFileSync(filename, content)
}

module.exports = {
  exists,
  read,
  write
}
