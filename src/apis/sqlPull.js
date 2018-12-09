const { google } = require('googleapis')
const sqlAdmin = google.sqladmin('v1beta4')
const async = require('async')
const getDefaultAuthClient = require('./googleapis').getDefaultAuthClient
const auth = getDefaultAuthClient()
const tmp = require('tmp')

module.exports = function (connectionName, databaseName) {
  const [project, region, instance] = connectionName.split(':')
  const state = {
    connectionName: connectionName,
    databaseName: databaseName,
    bucketExists: false,
    serviceAccountEmailAddress: null,
    entityHaveAccess: false,
    operationName: null,
    destFilename: tmp.fileSync().name,
    bucketAcl: null,
    entityAcl: null
  }
  const cloudStorage = require('@google-cloud/storage')({
    projectId: project
  })
  const bucketName = connectionName.replace(/:/g, '_')
  const gscFilename = 'tmp/' + databaseName + '.sql'
  const gscUri = 'gs://' + bucketName + '/' + gscFilename
  const bucket = cloudStorage.bucket(bucketName)

  async.series([
    function (callback) {
      const request = { project, instance, auth }
      sqlAdmin.instances.get(request, function (err, response) {
        if (err) {
          let mssg = 'Failed to get database service account: ' + err.message
          console.log(mssg)
          callback(mssg)
        } else {
          state.serviceAccountEmailAddress = response.data.serviceAccountEmailAddress
          callback()
        }
      })
    },
    function (callback) {
      bucket.acl.get().then(results => {
        const entity = 'user-' + state.serviceAccountEmailAddress
        state.bucketAcl = results[0]
        state.bucketExists = true
        state.entityAcl = state.bucketAcl.find(e => e.entity === entity && e.role === 'WRITER')
      }).catch(error => {
        console.warn(error.message)
      }).finally(() => {
        callback()
      })
    },
    function (callback) {
      if (!state.bucketExists) {
        bucket.create({
          storageClass: 'multi_regional'
        }).then(() => {
          console.log(`Bucket ${bucketName} created.`)
          state.bucketExists = true
          callback()
        }).catch(err => {
          let mssg = 'Error ' + err.message + ''
          console.error(mssg)
          callback(mssg)
        })
      } else {
        console.log(`Bucket ${bucketName} allready exists.`)
        callback()
      }
    },
    function (callback) {
      if (state.entityAcl) {
        console.log('Entity already have access, doesn\'t need to do anything.')
        callback()
      } else if (state.bucketExists && state.serviceAccountEmailAddress) {
        const entity = 'user-' + state.serviceAccountEmailAddress
        console.log(state)
        bucket.acl.add({
          entity: entity,
          role: cloudStorage.acl.WRITER_ROLE
        }).then(function (result) {
          console.log(entity + ' added to ACL.')
          state.entityAcl = result[0]
        }).catch(err => {
          console.warn(err.message)
        }).finally(() => {
          callback()
        })
      } else {
        console.log('Couln\'t add for some reason...')
      }
    },
    function (callback) {
      const resource = {
        exportContext: {
          uri: gscUri,
          databases: [state.databaseName]
        }
      }
      const request = { project, instance, auth, resource }
      sqlAdmin.instances.export(request, function (err, response) {
        if (err) {
          console.error(err.message)
          callback('Script stopped due to error: ' + err.message)
        } else {
          state.operationName = response.data.name
          callback()
        }
      })
    },
    function (callback) {
      const operationRequest = { project, instance, auth, operation: state.operationName }
      let intervalHandle = setInterval(function () {
        sqlAdmin.operations.get(operationRequest, function (err, response) {
          if (err) {
            console.error(err.message)
            callback(err.message)
            return
          }
          console.log('Polling for operation result: ', response.data.status)
          if (response.data.status !== 'RUNNING' && response.data.status !== 'PENDING') {
            console.log('Clearing polling interval')
            clearInterval(intervalHandle)
            if (response.data.status !== 'DONE') {
              callback('Something weird happened, quitting execution.')
            } else {
              callback()
            }
          }
        })
      }, 5000)
    },
    function (callback) {
      const options = {
        destination: state.destFilename
      }
      // Downloads the file
      bucket
        .file(gscFilename)
        .download(options)
        .then(() => {
          console.log(
            `gs://${bucketName}/${gscFilename} downloaded to ${state.destFilename}.`
          )
        })
        .catch(err => {
          console.error('ERROR:', err)
        }).finally(() => callback())
    },
    function (callback) {
      const { execSync } = require('child_process')
      try {
        execSync(`mysql -u root < ${state.destFilename}`)
        console.log('Data should have been written to mysql now.')
        callback()
      } catch (err) {
        callback(err.message)
      }
    }
  ], function () {
    // Finished
    console.log('Script is done, great.')
  })
}
