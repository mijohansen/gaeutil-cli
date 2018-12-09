const { execSync } = require('child_process')

const getAccessToken = function () {
  return execSync('gcloud auth application-default print-access-token').toString().trim()
}
const getAccount = function () {
  return execSync('gcloud config list account --format "value(core.account)"').toString().trim()
}
module.exports = {
  getAccessToken,
  getAccount
}
