const { execSync } = require('child_process')

const getAuthor = function () {
  let gitConfig = {}
  gitConfig.email = execSync('git config --global user.email').toString().trim()
  gitConfig.name = execSync('git config --global user.name').toString().trim()
  return gitConfig
}

module.exports = {
  getAuthor
}
