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
import { TRACKED_TOKENS } from "../../scripts/alchemy/alchemyTypes.js";

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

      FinanceSnapshot_generateSnapshotFromAccounts: async (
        _: unknown,
        args: {
          docId: string;
          accountsDocumentId: string;
          owner: string;
          periodStart: string;
          periodEnd: string;
        },
      ) => {
        const { docId, accountsDocumentId, owner, periodStart, periodEnd } =
          args;

        try {
          // Fetch the Accounts document
          const accountsDoc = await reactor.getDocument(accountsDocumentId);
          if (!accountsDoc) {
            throw new Error(
              `Accounts document not found: ${accountsDocumentId}`,
            );
          }

          if (accountsDoc.header.documentType !== "powerhouse/accounts") {
            throw new Error(
              `Invalid document type: ${accountsDoc.header.documentType}. Expected "powerhouse/accounts".`,
            );
          }

          const accountsState = accountsDoc.state as any;
          const accounts = accountsState?.global?.accounts || [];

          if (accounts.length === 0) {
            throw new Error("No accounts found in the Accounts document.");
          }

          // Validate all accounts have transaction files
          const accountsWithoutTransactions = accounts.filter(
            (acc: any) => !acc.accountTransactionsId,
          );
          if (accountsWithoutTransactions.length > 0) {
            const missingNames = accountsWithoutTransactions
              .map((acc: any) => acc.name || acc.account)
              .join(", ");
            throw new Error(
              `The following accounts do not have transaction files: ${missingNames}. All accounts must have transaction files before creating a snapshot.`,
            );
          }

          // Create the snapshot
          const snapshotId = crypto.randomUUID();
          const now = new Date().toISOString();
          const startDate = new Date(periodStart).toISOString();
          const endDate = new Date(periodEnd).toISOString();
          const period = `${periodStart} to ${periodEnd}`;

          // Create snapshot
          await reactor.addAction(
            docId,
            actions.createSnapshot({
              id: snapshotId,
              name: `Snapshot ${period}`,
              period: period,
              periodStart: startDate,
              periodEnd: endDate,
              owner: owner,
              created: now,
            }),
          );

          // Initialize from accounts with tracked tokens
          const accountInputs = accounts.map((acc: any) => ({
            id: acc.id,
            address: acc.account,
            name: acc.name,
            accountType: acc.type || "Protocol",
            accountTransactionsId: acc.accountTransactionsId,
          }));

          await reactor.addAction(
            docId,
            actions.initializeFromAccounts({
              accountsDocumentId: accountsDocumentId,
              accounts: accountInputs,
              tokens: TRACKED_TOKENS,
            }),
          );

          // Calculate balances
          const periodStartDate = new Date(startDate);
          const periodEndDate = new Date(endDate);
          let totalTransactions = 0;

          const startingBalancesByWalletToken = new Map<string, bigint>();
          const balancesByWalletToken = new Map<
            string,
            {
              wallet: string;
              token: string;
              accountType: string;
              inflows: bigint;
              outflows: bigint;
              internalInflows: bigint;
              internalOutflows: bigint;
            }
          >();

          // Process each account
          for (const account of accounts) {
            const txnsDoc = await reactor.getDocument(
              account.accountTransactionsId,
            );
            if (!txnsDoc) {
              console.warn(
                `Transactions document not found for account ${account.name}`,
              );
              continue;
            }

            const txnsState = txnsDoc.state as any;
            const transactions = txnsState?.global?.transactions || [];

            // Calculate starting balances from historical transactions
            const historicalTransactions = transactions
              .filter((tx: any) => {
                const txDate = new Date(tx.datetime);
                return txDate < periodStartDate;
              })
              .sort((a: any, b: any) => {
                return (
                  new Date(a.datetime).getTime() -
                  new Date(b.datetime).getTime()
                );
              });

            for (const tx of historicalTransactions) {
              const token = tx.details?.token || "ETH";
              const balanceKey = `${account.account}-${token}`;
              const isInflow = tx.direction === "INFLOW";
              const amountValue = BigInt(
                Math.floor(parseFloat(tx.amount.value) * 1e18),
              );

              if (!startingBalancesByWalletToken.has(balanceKey)) {
                startingBalancesByWalletToken.set(balanceKey, 0n);
              }

              const currentBalance =
                startingBalancesByWalletToken.get(balanceKey)!;
              const newBalance = isInflow
                ? currentBalance + amountValue
                : currentBalance - amountValue;

              if (newBalance < 0n && !isInflow) {
                console.warn(
                  `[Snapshot] Negative balance for ${account.name} (${token}): ${Number(newBalance) / 1e18}`,
                );
              }

              startingBalancesByWalletToken.set(balanceKey, newBalance);
            }

            // Process period transactions
            const periodTransactions = transactions.filter((tx: any) => {
              const txDate = new Date(tx.datetime);
              return txDate >= periodStartDate && txDate <= periodEndDate;
            });

            for (const tx of periodTransactions) {
              const txId = crypto.randomUUID();
              const token = tx.details?.token || "ETH";
              const amount = tx.amount;
              const isInflow = tx.direction === "INFLOW";

              const flowType = isInflow
                ? "EXTERNAL_INFLOW"
                : "EXTERNAL_OUTFLOW";

              await reactor.addAction(
                docId,
                actions.addTransaction({
                  id: txId,
                  block: tx.details?.blockNumber || null,
                  timestamp: tx.datetime,
                  txHash: tx.details?.txHash || "",
                  token: token,
                  counterParty: tx.counterParty,
                  amount: amount,
                  txLabel: tx.description || null,
                  counterPartyName: tx.counterPartyLabel || null,
                  flowType: flowType,
                  fromWalletType: isInflow ? null : account.type || "Protocol",
                  toWalletType: isInflow ? account.type || "Protocol" : null,
                }),
              );

              totalTransactions++;

              // Track balances
              const balanceKey = `${account.account}-${token}`;
              if (!balancesByWalletToken.has(balanceKey)) {
                balancesByWalletToken.set(balanceKey, {
                  wallet: account.account,
                  token: token,
                  accountType: account.type || "Protocol",
                  inflows: 0n,
                  outflows: 0n,
                  internalInflows: 0n,
                  internalOutflows: 0n,
                });
              }

              const balance = balancesByWalletToken.get(balanceKey)!;
              const amountValue = BigInt(
                Math.floor(parseFloat(amount.value) * 1e18),
              );

              if (isInflow) {
                balance.inflows += amountValue;
              } else {
                balance.outflows += amountValue;
              }
            }
          }

          // Update balances
          const formatAmount = (value: bigint, unit: string) => ({
            value: (Number(value) / 1e18).toFixed(6),
            unit: unit,
          });

          for (const [key, balanceData] of balancesByWalletToken.entries()) {
            const netChange = balanceData.inflows - balanceData.outflows;
            const startingBalance =
              startingBalancesByWalletToken.get(key) || 0n;
            const endingBalance = startingBalance + netChange;

            await reactor.addAction(
              docId,
              actions.updateWalletBalance({
                id: key,
                walletAddress: balanceData.wallet,
                accountType: balanceData.accountType,
                token: balanceData.token,
                startingBalance: formatAmount(
                  startingBalance,
                  balanceData.token,
                ),
                endingBalance: formatAmount(endingBalance, balanceData.token),
                externalInflow: formatAmount(
                  balanceData.inflows,
                  balanceData.token,
                ),
                externalOutflow: formatAmount(
                  balanceData.outflows,
                  balanceData.token,
                ),
                internalInflow: formatAmount(
                  balanceData.internalInflows,
                  balanceData.token,
                ),
                internalOutflow: formatAmount(
                  balanceData.internalOutflows,
                  balanceData.token,
                ),
                netExternalChange: formatAmount(netChange, balanceData.token),
              }),
            );
          }

          // Handle tokens with starting balance but no activity
          for (const [
            key,
            startingBalance,
          ] of startingBalancesByWalletToken.entries()) {
            if (!balancesByWalletToken.has(key)) {
              const [walletAddress, token] = key.split("-");
              const account = accounts.find(
                (acc: any) => acc.account === walletAddress,
              );

              if (account) {
                await reactor.addAction(
                  docId,
                  actions.updateWalletBalance({
                    id: key,
                    walletAddress: walletAddress,
                    accountType: account.type || "Protocol",
                    token: token,
                    startingBalance: formatAmount(startingBalance, token),
                    endingBalance: formatAmount(startingBalance, token),
                    externalInflow: formatAmount(0n, token),
                    externalOutflow: formatAmount(0n, token),
                    internalInflow: formatAmount(0n, token),
                    internalOutflow: formatAmount(0n, token),
                    netExternalChange: formatAmount(0n, token),
                  }),
                );
              }
            }
          }

          return {
            success: true,
            message: `Snapshot created successfully for period ${period}`,
            snapshotId: snapshotId,
            accountsProcessed: accounts.length,
            transactionsImported: totalTransactions,
            balancesCalculated: balancesByWalletToken.size,
          };
        } catch (error) {
          console.error("[FinanceSnapshot] Error generating snapshot:", error);
          return {
            success: false,
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
            snapshotId: null,
            accountsProcessed: 0,
            transactionsImported: 0,
            balancesCalculated: 0,
          };
        }
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
