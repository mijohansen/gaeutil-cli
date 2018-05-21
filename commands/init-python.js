const packageJsonExists = require('../src/utils').packageJsonExists
const addRunConfig = require('./add-package-json-commands')
const ensureDir = require('../src/utils').ensureDir


module.exports = function (project, service) {
    if (!packageJsonExists()) {
        console.log('Package.json doesn\'t exist. Please create a new project with npm init')
        return false
    }
    ensureDir("config")
    addRunConfig()
}
