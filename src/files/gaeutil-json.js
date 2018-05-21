const {fileExists} = require('../utils')
const filename = 'config/gaeutil.json'
const read = function () {
  return jsonfile.readFileSync(filename)
}
const write = function (fileContent) {
  jsonfile.writeFileSync(filename, fileContent, {
    spaces: 2,
    EOL: '\r\n'
  })
}
const exists = function () {
  return fileExists(filename)
}

module.exports = {
  exists,
  read,
  write
}

/**
 * appYaml
 * gaeutilJson
 * packageJson
 * jetbrains: workspaceXml
 * php55: composerJson
 * java8: pomXml
 * java8: appengineWebXml
 *
 * gaeutilJson.exists()
 * gaeutilJson.read()
 * gaeutilJson.write(fileContent)
 * gaeutilJson.create()
 *
 * To ensure that commands can be overwritten tool will install it self in the
 * local package.json with standard commands on the first run. this make it possible
 * for a user to override a certain command, or completely ignore it.
 *
 * gaeutil init-php
 * gaeutil init-python
 * gaeutil init-flask
 * gaeutil init-slim
 * gaeutil jetbrains
 * gaeutil status
 * gaeutil sync-all
 * gaeutil sync-authors
 * gaeutil sync-scripts
 * gaeutil sync-config
 * gaeutil sync-skip-files
 * gaeutil secret-pull gs://redperformance/stitch_import_api_test.json
 * gaeutil secret-push gs://redperformance/stitch_import_api_test.json
 * gaeutil secrets-pull
 * gaeutil secrets-push
 * x gaeutil init-java
 * x gaeutil init-node-flex
 * x gaeutil init-python-flex
 */
