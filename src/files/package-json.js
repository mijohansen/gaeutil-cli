const jsonfile = require('jsonfile')
const {fileExists} = require('../utils')
const appYaml = require('./app-yaml').read()
const filename = 'package.json'
const {intersection} = require('lodash')
const read = function () {
  let packageJson = {}
  if (exists()) {
    packageJson = jsonfile.readFileSync(filename)
  }
  return packageJson
}
const write = function (content) {
  jsonfile.writeFileSync(filename, content, {
    spaces: 2,
    EOL: '\r\n'
  })
}
const exists = function () {
  return fileExists(filename)
}
const getScripts = function () {
  let packageJson = read()
  if (packageJson.scripts) {
    return packageJson.scripts
  } else {
    return {}
  }
}
const addAppEngineScripts = function (project) {
  let obj = jsonfile.readFileSync(filename)
  if (!obj.scripts) {
    obj.scripts = {}
  }
  // @todo check app.yaml for type deveserve
  if (['PHP55', 'Python'].includes(appYaml.runtime)) {
    obj.scripts.devserve = 'dev_appserver.py --port=5000 . -A ' + project
    obj.scripts.deploy = 'gcloud app deploy app.yaml --project ' + project + ' --promote --quiet'
  }
  if (appYaml.service === 'default') {
    obj.scripts['deploy-cron'] = 'gcloud app deploy cron.yaml --project ' + project + ' --promote --quiet'
    obj.scripts['deploy-queue'] = 'gcloud app deploy queue.yaml --project ' + project + ' --promote --quiet'
    obj.scripts['deploy-dispatch'] = 'gcloud app deploy dispatch.yaml --project ' + project + ' --promote --quiet'
  }
  return write(obj)
}
const serveScripts = ['devserve', 'start', 'serve', 'startserver', 'dev']

const getServeScripts = function () {
  let packageJsonScripts = Object.keys(getScripts())
  return intersection(packageJsonScripts, serveScripts)
}

module.exports = {
  getScripts,
  getServeScripts,
  addAppEngineScripts,
  read,
  exists,
  write
}