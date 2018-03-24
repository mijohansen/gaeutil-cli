#!/usr/bin/env node

const program = require('commander')
//const colors = require('colors');


program
    .command('gaeutil')
    .option('-r, --recursive', 'Remove recursively')
    .action(require("./commands/app-yaml"))

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

program
    .command('init-php')
    .option('-r, --recursive', 'Remove recursively')
    .action(require("./commands/init-php"))
*/

program.parse(process.argv)

if (program.args.length === 0) {
    program.help()
}