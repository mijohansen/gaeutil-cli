const writePackageJson = require("../src/files/package-json").write
const getComposerJson = require("../src/files/composer-json").read
const writeComposerJson = require("../src/files/composer-json").write

const packageJsonExists = require('../src/utils').packageJsonExists
const {ensureDir} = require('../src/utils')
const {addScripts,getPackageJson} = require('../src/files/package-json')


module.exports = function (project, service) {
    if (!packageJsonExists()) {
        console.log('Package.json doesn\'t exist. Please create a new project with npm init')
        return
    }
    ensureDir('config')
    ensureDir('routes')
    ensureDir('tests')
    ensureDir('app')
    let composerJsonContent = baseComposerJson(project, service)
    writeComposerJson(composerJsonContent)
    let packageJsonContent = getPackageJson()
    packageJsonContent.project = project
    writePackageJson(packageJsonContent)
    addScripts(project)

}

