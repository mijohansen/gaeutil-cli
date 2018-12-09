const gitignoreExists = require('../src/utils').gitignoreExists
const ignore = require('ignore')
const fs = require('fs')
const addRunConfig = require('./add-package-json-commands')
const defaultIgnores = ['secrets']

module.exports = function (service) {
  if (!gitignoreExists()) {
    console.log('NoGitIgnore.json doesn\'t exist. Please create a new project with npm init')
    return false
  }
  let ignoresIdea = ignore()
    .add(fs.readFileSync('.gitignore').toString())
  console.log('ignoresIdea:', ignoresIdea.ignores('.idea/workspace.xml'))

  console.log(ignoresIdea._rules)
}
