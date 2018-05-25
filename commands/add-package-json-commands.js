
const appYamlExists = require('../src/files/app-yaml').exists
const packageJsonExists = require('../src/files/package-json').exists
/*
- Check if app.yaml exists
- add devserve command
- add deploy command
 */

module.exports = function (project, service) {

    if (!appYamlExists) {
        console.log('app.yaml doesn\'t exists no extra commands.')
        return
    }
    if (!packageJsonExists) {
        console.log('package.json doesn\'t exists no extra commands.')
        return
    }

}
