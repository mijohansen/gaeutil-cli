const packageJsonExists = require('../src/utils').packageJsonExists
const ensureDir = require('../src/utils').ensureDir
const baseComposerJson = require('../src/base').baseComposerJson
const writeComposerJson = require('../src/base').writeComposerJson
const addRunConfig = require('./add-package-json-commands')


module.exports = function (project, service) {
    if (!packageJsonExists()) {
        console.log('Package.json doesn\'t exist. Please create a new project with npm init')
        return false
    }
    let composerJsonObject = baseComposerJson(project, service)
    composerJsonObject.require['mijohansen/php-gae-slim'] = '*'
    writeComposerJson(composerJsonObject)
    ensureDir("app")
    ensureDir("routes")
    ensureDir("config")
    ensureDir("tests")
    addRunConfig(project, service)
}
