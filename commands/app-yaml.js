const appYaml = require('../src/files/app-yaml').read

module.exports = function (params) {
    console.log(appYaml())
}
