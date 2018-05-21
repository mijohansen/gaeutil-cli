const DOMParser = require('xmldom').DOMParser
const serveScripts = require('../src/files/package-json').getServeScripts()
const {intersection,difference} = require('lodash')
const workspaceXml = require('../src/files/workspace-xml')
const filename = '.idea/workspace.xml'
const getCmndNames = function (cmdPrefix) {
  return serveScripts.map(elem => cmdPrefix + elem)
}

module.exports = function (project, service) {
  let content = workspaceXml.read()
  let doc = new DOMParser().parseFromString(content)
  let runManagerName = 'RunManager'
  let components = doc.getElementsByTagName('component')
  let RunManager
  for (let i = 0, len = components.length; i < len; i++) {
    if (components.item(i).getAttribute('name') === runManagerName) {
      RunManager = components.item(i)
    }
  }
  /**
   *
   * Creating a runmanager if it doesn't exist.
   */
  if (!RunManager) {
    RunManager = doc.createElement('component')
    RunManager.setAttribute('name', runManagerName)
    doc.getElementsByTagName('project').item(0).appendChild(RunManager)
  }
  let scripts = RunManager.getElementsByTagName('configuration')

  let cmdPrefix = 'npm '
  let cmndNames = getCmndNames(cmdPrefix)
  let cmndsThatExists = []
  for (let i = 0, len = scripts.length; i < len; i++) {
    let scriptName = scripts.item(i).getAttribute('name')
    if (cmndNames.includes(scriptName)) {
      console.log('NPM command ' + scriptName + ' already exists, skipping.')
      cmndsThatExists.push(scriptName)
    }
  }
  let cmndsToCreate = difference(cmndNames, cmndsThatExists)
  cmndsToCreate.forEach(function (cmndName) {
    let npmScriptToEnsure = cmndName.substring(cmdPrefix.length)
    console.log('Adding "' + cmndName + '" npm run to Runmanager.')
    let configurationTag = doc.createElement('configuration')
    configurationTag.setAttribute('name', cmndName)
    configurationTag.setAttribute('type', 'js.build_tools.npm')
    configurationTag.setAttribute('factoryName', 'npm')

    let packageJsonTag = doc.createElement('package-json')
    packageJsonTag.setAttribute('value', '$PROJECT_DIR$/package.json')
    configurationTag.appendChild(packageJsonTag)

    let commandTag = doc.createElement('command')
    commandTag.setAttribute('value', 'run')
    configurationTag.appendChild(commandTag)

    let scriptsTag = doc.createElement('scripts')
    let scriptTag = doc.createElement('script')
    scriptTag.setAttribute('value', npmScriptToEnsure)
    scriptsTag.appendChild(scriptTag)
    configurationTag.appendChild(scriptsTag)

    let nodeInterpreter = doc.createElement('node-interpreter')
    nodeInterpreter.setAttribute('value', 'project')
    configurationTag.appendChild(nodeInterpreter)
    configurationTag.appendChild(doc.createElement('envs'))
    RunManager.appendChild(configurationTag)
    RunManager.setAttribute('selected', 'npm.' + cmndNames)
  })
  if(cmndsToCreate.length>0){
    workspaceXml.write(doc.toString())
    console.log('New config written to ' + filename)
  } else {
    console.log('Nothing to do.')
  }
}


/*
Check if package.json exists
Check if .idea/workspace.xml
Go through NPM commands and add them to the RunManager if not existing.
- npm start
- npm devserve
- npm serve
 */