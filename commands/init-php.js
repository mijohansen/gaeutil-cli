const packageJsonExists = require('../src/files/package-json').exists
const packageJsonRead = require('../src/files/package-json').read
const packageJsonWrite = require('../src/files/package-json').write

const composerJsonRead = require('../src/files/composer-json').read
const composerJsonWrite = require('../src/files/composer-json').write

const {ensureDir} = require('../src/utils')
const {addAppEngineScripts} = require('../src/files/package-json')
/**
 * Create and update
 * - app.yaml => add skip files, correct modules etc
 * - composer.json => install packages etc
 * - .gitignore => add special folders
 * - package.json => add scripts
 * - if no handlers create simple handler and main.php in app.yaml
 *
 * @param project
 * @param service
 */
module.exports = function (project, service) {
  if (!packageJsonExists()) {
    console.log('Package.json doesn\'t exist. Please create a new project with npm init')
    return
  }
  ensureDir('config')
  ensureDir('routes')
  ensureDir('tests')
  ensureDir('app')

  let composerJsonContent = composerJsonRead(project, service)

  let packageJsonContent = packageJsonRead()
  packageJsonContent.project = project
  writePackageJson(packageJsonContent)
  composerJsonWrite(composerJsonContent)
  addAppEngineScripts(packageJsonContent)

}

