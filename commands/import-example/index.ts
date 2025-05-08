import { Command, type CommandOptions } from '@commander-js/extra-typings';
import { run } from './run.js';
import { createFinancesDrive, populateTransactionsDocument } from './utils/populateTransactionsDocument.js';

export const buildCommand = (opts: CommandOptions) => {
    return new Command()
        .command('import-example', opts)
        .argument('<addresses...>', 'List of addresses to be imported')
        .action(async (addresses: any) => {
            await run({ addresses });
        });
};

export const accountsCommand = (opts: CommandOptions) => {
    return new Command()
        .command('import-accounts', opts)
        .argument('<documentId>', 'Document ID of the document to import accounts from')
        .action(async (documentId: string) => {
            console.log("Document ID:", documentId);
            await populateTransactionsDocument(documentId);
        });
};

export const createFinancesDriveCommand = () => {
    return new Command()
        .command('create-finances-drive')
        .action(async () => {
            console.log("Creating finances drive...");
            const driveId = await createFinancesDrive();
            if (!driveId) {
                return;
            }
            console.log("Finances drive created with ID:", driveId);
        });
};