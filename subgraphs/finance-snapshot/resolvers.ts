import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type CreateSnapshotInput,
  type AddWalletInput,
  type RemoveWalletInput,
  type UpdatePeriodInput,
  type RefreshSnapshotDataInput,
  type AddTransactionInput,
  type UpdateWalletBalanceInput,
  type FinanceSnapshotDocument,
} from "../../document-models/finance-snapshot/index.js";
import { setName } from "document-model";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      FinanceSnapshot: async () => {
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
              await reactor.getDocument<FinanceSnapshotDocument>(docId);
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
                  await reactor.getDocument<FinanceSnapshotDocument>(docId);
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
                doc.header.documentType === "powerhouse/finance-snapshot",
            );
          },
        };
      },
    },
    Mutation: {
      FinanceSnapshot_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          "powerhouse/finance-snapshot",
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/finance-snapshot",
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      FinanceSnapshot_createSnapshot: async (
        _: unknown,
        args: { docId: string; input: CreateSnapshotInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.createSnapshot(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to createSnapshot");
        }

        return true;
      },

      FinanceSnapshot_addWallet: async (
        _: unknown,
        args: { docId: string; input: AddWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addWallet(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addWallet");
        }

        return true;
      },

      FinanceSnapshot_removeWallet: async (
        _: unknown,
        args: { docId: string; input: RemoveWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeWallet(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeWallet");
        }

        return true;
      },

      FinanceSnapshot_updatePeriod: async (
        _: unknown,
        args: { docId: string; input: UpdatePeriodInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updatePeriod(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updatePeriod");
        }

        return true;
      },

      FinanceSnapshot_refreshSnapshotData: async (
        _: unknown,
        args: { docId: string; input: RefreshSnapshotDataInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.refreshSnapshotData(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to refreshSnapshotData",
          );
        }

        return true;
      },

      FinanceSnapshot_addTransaction: async (
        _: unknown,
        args: { docId: string; input: AddTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
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

      FinanceSnapshot_updateWalletBalance: async (
        _: unknown,
        args: { docId: string; input: UpdateWalletBalanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FinanceSnapshotDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateWalletBalance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateWalletBalance",
          );
        }

        return true;
      },
    },
  };
};
