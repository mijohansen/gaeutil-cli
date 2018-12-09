const sqlCopyDb = require('../src/apis/sqlPull')
/**
 * sql-pull
 *
 *
 * @param connectionName
 * @param databaseName
 */
module.exports = function (connectionName, databaseName) {
  sqlCopyDb(connectionName, databaseName)
}
