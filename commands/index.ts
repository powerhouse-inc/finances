import { program } from '@commander-js/extra-typings';
import { buildCommand } from './import-example/index.js';

program
  .name('cmd')
  .addCommand(buildCommand(program.opts()))
  .parse();

