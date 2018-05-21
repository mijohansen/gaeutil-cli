const jsyaml = require('js-yaml')
const fs = require('fs')
const fileExists = require('../utils').fileExists
const dirExists = require('../utils').dirExists
const {uniq, forEach} = require('lodash')
const filename = 'app.yaml'
const exists = function () {
  return fileExists(filename)
}
const read = function () {
  return jsyaml.load(fs.readFileSync(filename))
}
const write = function (fileContent) {
  return jsyaml.safeDump(fileContent)
}

const ignoreDirs = ['.idea', 'nbproject', '.vscode', 'vendor/bin', 'node_modules/.bin', 'logs', 'secrets']
const ignoreFileEndings = ['bat', 'bak', 'log', 'lock', 'md', 'mdown', 'zip', 'sh', 'dist', 'pyc', 'xml']
const ignoreFiles = ['README', 'LICENSE', '.gitignore', '.travis.yml', '.gitattributes']
const ignorePhpSpesific = ['^vendor(.*/vendor).*']
const ignoreGeneric = ['^(.*/)?.*/[Tt]ests/.*$', '^(.*/)?#.*#$', '^(.*/)?.*~$', '^(.*/)?.*\\.py[co]$', '^(.*/)?.*/RCS/.*$', '^(.*/)?\\..*$']
const runtimes = ['python27', 'php55']

const addSkipFiles = function (appYamlObj) {
  if (!appYamlObj.skip_files) {
    appYamlObj.skip_files = []
  }
  ignoreDirs.forEach(function (dirname) {
    if (dirExists(dirname)) {
      appYamlObj.skip_files.push(dirname + '/')
    }
  })
  ignoreGeneric.forEach(function (ignore) {
    appYamlObj.skip_files.push(ignore)
  })
  ignoreFileEndings.forEach(function (ending) {
    appYamlObj.skip_files.push('^(.*/)?.*\.' + ending + '$')
  })
  ignorePhpSpesific.forEach(function (ignore) {
    appYamlObj.skip_files.push(ignore)
  })
  appYamlObj.skip_files = uniq(appYamlObj.skip_files.sort())
  return appYamlObj
}

const fixDefaults = function (appYamlContent) {
  let lines = appYamlContent.split('\n')
  let defaultLines = {
    'threadsafe': ' true',
    'api_version': ' 1',
    'service': ' default',
    'runtime': ' unknown'
  }
  let newLines = []
  lines.forEach(function (line) {
    let parts = line.split(':')
    if (defaultLines[parts[0]]) {
      defaultLines[parts[0]] = parts[1]
    } else if (parts[0] === 'module') {
      defaultLines['service'] = parts[1]
    } else {
      newLines.push(line)
    }
  })
  forEach(defaultLines, function (elem, key) {
    let part = [key, elem].join(':')
    newLines.unshift(part)
  })
  return newLines.join('\n')
}

const simpleValidate = function (appYamlContent) {
  return runtimes.includes(appYamlContent.runtime)
}

module.exports = {
  exists,
  read,
  write,
  addSkipFiles,
  simpleValidate,
  fixDefaults
}