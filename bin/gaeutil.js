#!/usr/bin/env node

const program = require('commander')
const colors = require('colors')
require('pkginfo')(module)

program
  .version(module.exports.version)
  .command('ignore')
  .option('-r, --recursive', 'Remove recursively'.red)
  .action(require('../commands/ignore'))

program
  .command('status')
  .option('-r, --recursive', 'Remove recursively'.red)
  .action(require('../commands/status'))

program
  .command('jetbrains')
  .option('-r, --recursive', 'Remove recursively'.red)
  .action(require('../commands/jetbrains'))

program
  .command('add-author')
  .option('-r, --recursive', 'Remove recursively'.red)
  .action(require('../commands/add-author'))

program
  .command('secret-init <secret-filepath> <projectId>')
  .option('-r, --recursive', 'Remove recursively'.red)
  .action(require('../commands/secret-init'))

program
  .command('secret-push <secret-filepath>')
  .action(require('../commands/secret-push'))

program
  .command('secret-pull <secret-filepath>')
  .action(require('../commands/secret-pull'))

program
  .command('secret-view <secret-filepath>')
  .action(require('../commands/secret-view'))

program
  .command('sql-pull <connection-name> <database-name>')
  .action(require('../commands/sql-pull'))

program
  .command('init-php')
  .option('-r, --recursive', 'Remove recursively')
  .action(require('../commands/init-php'))

program
  .command('app-yaml')
  .option('-r, --recursive', 'Remove recursively')
  .action(require('../commands/app-yaml'))

/*

program
    .command('fix-package')
    .option('-r, --recursive', 'Remove recursively')
    .action(require("./commands/fix-package-json"))

program
    .command('add-devserve')
    .option('-r, --recursive', 'Remove recursively')
    .action(require("./commands/add-run-config"))

program
    .command('gaeutil')
    .option('-r, --recursive', 'Remove recursively')
    .action(require("./commands/add-package-json-commands"))

*/

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
