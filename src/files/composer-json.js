const { fileExists } = require('../utils')
const { execSync } = require('child_process')
const jsonfile = require('jsonfile')
const isArray = require('lodash').isArray
const isObject = require('lodash').isObject
const filename = 'composer.json'

const read = function () {
  return jsonfile.readFileSync(filename)
}
const write = function (composerJsonObject) {
  jsonfile.writeFileSync(filename, composerJsonObject, {
    spaces: 2,
    EOL: '\r\n'
  })
}
const exists = function () {
  return fileExists(filename)
}

/**
 * Upsert composer.json and sync with package.json
 *
 * @returns {*}
 */
const create = function () {
  let packageJson = basePackageJson()

  if (!composerJsonExists()) {
    execSync('composer init --type=project --license=MIT --quiet')
  }
  let composerJson = read()
  composerJson.license = packageJson.license
  if (!isArray(composerJson.authors)) {
    composerJson.authors = []
  }
  if (isObject(packageJson.author)) {
    composerJson.authors.push(packageJson.author)
  }
  if (!composerJson.require) {
    composerJson.require = {}
  }

  composerJson.require.php = '>=5.5.0'
  if (!composerJson.require['mijohansen/php-gae-slim'] || !composerJson.require['mijohansen/php-gae-util']) {
    composerJson.require['mijohansen/php-gae-util'] = '*'
  }
  composerJson['prefer-stable'] = true
  composerJson.scripts['post-update-cmd'] = 'GaeUtil\\PostInstall::cleanGoogleApiClasses'
  composerJson.scripts['post-install-cmd'] = 'GaeUtil\\PostInstall::cleanGoogleApiClasses'
  if (!composerJson.scripts) {
    composerJson.scripts = {}
  }
  return composerJson
}

const install = function () {
  return execSync('composer install --quiet')
}

module.exports = {
  create,
  write,
  exists,
  read,
  install
}
