import { program } from '@commander-js/extra-typings';
import { accountsCommand, buildCommand, } from './import-example/index.js';
program
  .name('cmd')
  .addCommand(buildCommand(program.opts()))
  .addCommand(accountsCommand(program.opts()))
  .parse();

