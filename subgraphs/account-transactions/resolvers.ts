/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { actions } from "../../document-models/account-transactions/index.js";
import { generateId, hashKey } from "document-model";
import { pullAlchemyData } from "../../commands/import-example/utils/pullAlchemyData.js";
import { CreateTransactionInput } from "../../document-models/account-transactions/index.js";

const DEFAULT_DRIVE_ID = "finances_accs_txs";

type ResultType = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: any | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: Record<string, any>;
  blockTimestamp: string;
};

export const getResolvers = (subgraph: Subgraph) => {
  const reactor = subgraph.reactor;

  return {
    Mutation: {
      AccountTransactions_createDocument: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId = generateId();

        await reactor.addDriveAction(
          driveId,
          addFile({
            id: docId,
            name: args.name,
            documentType: "powerhouse/account-transactions",
            synchronizationUnits: [
              {
                branch: "main",
                scope: "global",
                syncId: hashKey(),
              },
              {
                branch: "main",
                scope: "local",
                syncId: hashKey(),
              },
            ],
          }),
        );

        return docId;
      },

      AccountTransactions_createTransaction: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.createTransaction({ ...args.input }),
        );

        return doc.revision.global + 1;
      },

      AccountTransactions_updateTransaction: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.updateTransaction({ ...args.input }),
        );

        return doc.revision.global + 1;
      },

      AccountTransactions_deleteTransaction: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.deleteTransaction({ ...args.input }),
        );

        return doc.revision.global + 1;
      },

      AccountTransactions_updateTransactionBudget: async (
        _: any,
        args: any,
      ) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.updateTransactionBudget({ ...args.input }),
        );

        return doc.revision.global + 1;
      },

      AccountTransactions_updateAccount: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.updateAccount({ account: args.input.account }),
        );

        return doc.revision.global + 1;
      },

      AccountTransactions_importTransactions: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        console.log("importing transactions for addresses", args);
        // pull transactions from alchemy
        const results = await pullAlchemyData(args.input.addresses);

        // console.log("results", results);

        // // create transactions in document
        for (const resultArray of results) {
          for (const result of resultArray as any) {
            const counterPartyAddress = args.input.addresses[0].toLowerCase() === result.from.toLowerCase() ? result.to : result.from;
            // const counterPartyAddress = result.from.toLowerCase() === args.input.addresses[0].toLowerCase() ? result.to : result.from;
            const transactionInput: CreateTransactionInput = {
              counterParty: result.to,
              amount: result.value,
              datetime: result.blockTimestamp,
              details: {
                txHash: result.hash,
                token: result.asset,
                blockNumber: parseInt(result.blockNum, 16),
              },
            }
            // console.log("creating transaction", transactionInput);
            await reactor.addAction(driveId, docId, actions.createTransaction({ ...transactionInput }));
          }
        }
        return doc.revision.global + 1;
      },
    },
  };
};
