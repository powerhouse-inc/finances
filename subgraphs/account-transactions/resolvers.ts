/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { actions } from "../../document-models/account-transactions/index.js";
import { generateId, hashKey } from "document-model";
import { CreateTransactionInput } from "../../document-models/account-transactions/gen/types.js";
import { pullAlchemyData } from "../../commands/import-example/utils/pullAlchemyData.js";

const DEFAULT_DRIVE_ID = "powerhouse";

export const getResolvers = (subgraph: Subgraph): Record<string, any> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      AccountTransactions: async (_: any, args: any, ctx: any) => {
        return {
          getDocument: async (args: any) => {
            const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
            const docId: string = args.docId || "";
            const doc = await reactor.getDocument(driveId, docId);
            return {
              id: docId,
              driveId: driveId,
              ...doc,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.revision.global,
            };
          },
          getDocuments: async (args: any) => {
            const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc = await reactor.getDocument(driveId, docId);
                return {
                  id: docId,
                  driveId: driveId,
                  ...doc,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.revision.global,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.documentType === "powerhouse/account-transactions",
            );
          },
        };
      },
    },
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
          actions.updateAccount({ ...args.input }),
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
              id: generateId(),
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
