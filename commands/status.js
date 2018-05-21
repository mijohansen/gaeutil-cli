const gitignoreExists = require('../src/utils').gitignoreExists
const appYamlExists = require('../src/utils').appYamlExists
const packageJsonExists = require('../src/utils').packageJsonExists
const composerJsonExists = require('../src/utils').composerJsonExists
const inquirer = require('inquirer')
const uploadJson = require('../src/apis/cloud-storage').uploadJson

module.exports = function (cmd) {

    console.log(cmd.recursive)


    /*
    console.log('gitignoreExists'.red, gitignoreExists())
    console.log('appYamlExists'.red, appYamlExists())
    console.log('packageJsonExists'.red, packageJsonExists())
    console.log('composerJsonExists'.red, composerJsonExists())

    inquirer.prompt([{
        type: 'list',
        name: 'pill_selection',
        message: 'which pill?',
        choices: ['red', 'blue']}]).then(answers => {
        console.log(answers)
    })
*/
}
