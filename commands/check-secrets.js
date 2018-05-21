const googleapis = require('googleapis').google
const {execSync} = require('child_process')
const inquirer = require('inquirer')
const {getAccessToken} = require('../src/apis/gcloud')
/**
 * An app need to have access to both the place the
 * secrets are stored and the key to decryptJson them.
 *
 * @param service
 */
module.exports = function (service) {
    // grabs the access token from gcloud.
    let access_token = getAccessToken()
    if (!access_token) {
        console.error('Failed to acquire credentials')
        return
    }
    let authClient = new googleapis.auth.OAuth2()
    authClient.setCredentials({
        access_token: access_token
    })
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        authClient = authClient.createScoped([
            'https://www.googleapis.com/auth/cloud-platform'
        ])
    }
    // Instantiates an authorized client
    const cloudkms = googleapis.cloudkms({
        version: 'v1',
        auth: authClient
    })
    const request = {
        parent: 'projects/red-operations/locations/global'
    }

    // Lists key rings
    cloudkms.projects.locations.keyRings.list(request, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        const keyRings = result.data.keyRings || []
        if (!keyRings.length) {
            console.log(`No key rings found.`)
            return
        }
        let keycalls = []
        let cryptoKeyNames = []
        keyRings.forEach(function (keyRing) {
            let sub_request = {
                parent: keyRing.name
            }
            keycalls.push(new Promise(function (resolve, reject) {
                cloudkms.projects.locations.keyRings.cryptoKeys.list(sub_request, function (err, sub_result) {
                    sub_result.data.cryptoKeys.forEach(function (cryptoKey) {
                        cryptoKeyNames.push(cryptoKey.name)
                    })
                    resolve()
                })
            }))
        })
        Promise.all(keycalls).then(function(){
            inquirer.prompt([{
                type: 'list',
                name: 'key_name',
                message: 'which key?',
                choices: cryptoKeyNames
            }]).then(answers => {
                console.log(answers)
            })
        })

    })


}
