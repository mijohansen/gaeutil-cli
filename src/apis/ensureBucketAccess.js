
module.exports = function (bucket, file, serviceAccountEmail) {
  const entity = 'user-' + serviceAccountEmail
  let myObject = bucket.file(file)
  myObject.acl.add({
    'entity': entity,
    'role': 'READER'
  }).then(function (result) {
    console.log(result)
  }).catch(function (error) {
    console.log(error)
  })
}
