import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type AddTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionPeriodInput,
  type AddBudgetInput,
  type UpdateBudgetInput,
  type DeleteBudgetInput,
  type AccountTransactionsDocument,
} from "../../document-models/account-transactions/index.js";
import { setName } from "document-model";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      AccountTransactions: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<AccountTransactionsDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<AccountTransactionsDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) =>
                doc.header.documentType === "powerhouse/account-transactions",
            );
          },
        };
      },
    },
    Mutation: {
      AccountTransactions_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          "powerhouse/account-transactions",
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/account-transactions",
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      AccountTransactions_addTransaction: async (
        _: unknown,
        args: { docId: string; input: AddTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addTransaction");
        }

        return true;
      },

      AccountTransactions_updateTransaction: async (
        _: unknown,
        args: { docId: string; input: UpdateTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTransaction",
          );
        }

        return true;
      },

      AccountTransactions_deleteTransaction: async (
        _: unknown,
        args: { docId: string; input: DeleteTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to deleteTransaction",
          );
        }

        return true;
      },

      AccountTransactions_updateTransactionPeriod: async (
        _: unknown,
        args: { docId: string; input: UpdateTransactionPeriodInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTransactionPeriod(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTransactionPeriod",
          );
        }

        return true;
      },

      AccountTransactions_addBudget: async (
        _: unknown,
        args: { docId: string; input: AddBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addBudget(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addBudget");
        }

        return true;
      },

      AccountTransactions_updateBudget: async (
        _: unknown,
        args: { docId: string; input: UpdateBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateBudget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateBudget");
        }

        return true;
      },

      AccountTransactions_deleteBudget: async (
        _: unknown,
        args: { docId: string; input: DeleteBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteBudget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteBudget");
        }

        return true;
      },
    },
  };
};
