module.exports = {
  ...require('./src/utils'),
  ...require('./src/apis/secrets'),
  ...require('./src/apis/googleapis'),
  ...require('./src/apis/cloud-storage'),
  ...require('./src/apis/gcloud'),
}