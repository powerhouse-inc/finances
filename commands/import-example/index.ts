import { Command, type CommandOptions } from '@commander-js/extra-typings';
import { run } from './run.js';

export const buildCommand = (opts: CommandOptions) => {
    return new Command()
        .command('import-example', opts)
        .argument('<addresses...>', 'List of addresses to be imported')
        .action(async (addresses: any) => {
            await run({ addresses });
        });
};
