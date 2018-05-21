const cloudStorage = require('@google-cloud/storage')()

const uploadJson = function (bucketName, filename, data) {
  let myBucket = cloudStorage.bucket(bucketName)
  let file = myBucket.file(filename)
  let contents = JSON.stringify(data)
  return file.save(contents, {
    metadata: {
      contentType: 'application/json'
    }
  })
}

const downloadJson = function (bucketName, filename) {
  let myBucket = cloudStorage.bucket(bucketName)
  let file = myBucket.file(filename)
  return new Promise(function (resolveMain, rejectMain) {
    file.download(function (err, contents) {
      let jsonContent = JSON.parse(contents.toString())
      resolveMain(jsonContent)
    })
  })
}

/**
 * This function is fairly more complicated because you both have to check bucket permission and
 * the individual object permission.
 */
const checkAccess = function () {
  let myObject = cloudStorage.bucket('redperformance').file('global_config.json')
  myObject.acl.get().then(function (result) {
    console.log(result)
  })
  /*
    storage.bucket('redperformance').acl.get().then(function (result) {
      console.log(result)
    })
    */
  /*
  */
}

const ensureAccess = function (bucket, file, project) {
  let entity = 'user-' + project + '@appspot.gserviceaccount.com'
  let myObject = cloudStorage.bucket(bucket).file(file)
  myObject.acl.add({
    'entity': entity,
    'role': 'READER'
  }).then(function (result) {
    console.log(result)
  }).catch(function (error) {
    console.log(error)
  })
}

module.exports = {
  uploadJson,
  downloadJson,
  checkAccess,
  ensureAccess
}
