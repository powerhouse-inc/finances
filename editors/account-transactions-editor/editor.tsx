import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import {
  Button,
} from "@powerhousedao/document-engineering";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";
import { generateId } from "document-model/core";
import { setName } from "document-model";
import { useSelectedAccountTransactionsDocument } from "../hooks/useAccountTransactionsDocument.js";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setAccount,
} from "../../document-models/account-transactions/gen/creators.js";
import type {
  TransactionEntry,
  AddTransactionInput,
} from "../../document-models/account-transactions/gen/types.js";
import { TransactionsTable } from "./components/TransactionsTable.js";
import { TransactionForm } from "./components/TransactionForm.js";
import { AccountSection } from "./components/AccountSection.js";
import { DocumentHeader } from "./components/DocumentHeader.js";
import { alchemyIntegration } from "./alchemyIntegration.js";

type ViewMode = "list" | "add" | "edit";

export function Editor() {
  const [document, dispatch] = useSelectedAccountTransactionsDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTransaction, setEditingTransaction] = useState<TransactionEntry | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  function handleAddTransaction(values: Omit<AddTransactionInput, "id">) {
    dispatch(
      addTransaction({
        id: generateId(),
        ...values,
      })
    );
    setViewMode("list");
  }

  function handleUpdateTransaction(values: AddTransactionInput | Omit<AddTransactionInput, "id">) {
    if ("id" in values) {
      dispatch(updateTransaction(values));
    }
    setViewMode("list");
    setEditingTransaction(null);
  }

  function handleDeleteTransaction(id: string) {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction({ id }));
    }
  }

  function handleEditClick(transaction: TransactionEntry) {
    setEditingTransaction(transaction);
    setViewMode("edit");
  }

  function handleCancelForm() {
    setViewMode("list");
    setEditingTransaction(null);
  }

  async function handleFetchTransactions() {
    const account = document.state.global.account;
    if (!account?.account) {
      alert("Please set an account address first");
      return;
    }

    console.log("[Editor] Fetch transactions called with:", {
      address: account.account,
      documentName: document.header.name
    });

    setIsLoadingTransactions(true);
    try {
      // Try the new method first (when reactor is updated)
      try {
        const result = await alchemyIntegration.getTransactionsFromAlchemy(account.account);

        if (result.success) {
          console.log(`[Editor] Successfully fetched ${result.transactions.length} transactions from Alchemy`);
          console.log("TRANSACTIONS",result.transactions)
          console.log(`[Editor] Raw transactions from Alchemy (first 3):`, result.transactions.slice(0, 3).map(tx => ({
            hash: tx.txHash?.slice(0, 10),
            direction: tx.direction,
            from: tx.from?.slice(0, 8),
            to: tx.to?.slice(0, 8),
            counterParty: tx.counterParty?.slice(0, 8)
          })));

          // Get existing transaction hashes for deduplication
          const existingTxHashes = new Set(
            document.state.global.transactions.map(tx => tx.txHash)
          );
          console.log(`[Editor] Found ${existingTxHashes.size} existing transactions in document`);

          // Filter out transactions that already exist
          const newTransactions = result.transactions.filter(tx => !existingTxHashes.has(tx.txHash));
          console.log(`[Editor] Found ${newTransactions.length} new transactions (${result.transactions.length - newTransactions.length} duplicates skipped)`);

          if (newTransactions.length === 0) {
            alert("No new transactions found. All transactions from Alchemy are already in the document.");
            return;
          }

          // Add only new transactions to the local document
          let addedCount = 0;
          for (const txData of newTransactions) {
            // Validation - ensure we have required fields before adding
            if (!txData.direction) {
              console.error(`[Editor] Skipping transaction with undefined direction:`, txData);
              continue;
            }
            if (!txData.from || !txData.to) {
              console.error(`[Editor] Skipping transaction with undefined from/to:`, {
                hash: txData.txHash,
                from: txData.from,
                to: txData.to,
                direction: txData.direction
              });
              continue;
            }
            // Handle amount - it might come as string or object
            let amount;
            if (typeof txData.amount === 'string') {
              // Parse amount string back to object format (e.g., "10.5 ETH" -> {value: "10.5", unit: "ETH"})
              const amountParts = txData.amount.split(' ');
              amount = {
                value: amountParts[0] || "0",
                unit: amountParts[1] || txData.token
              };
            } else if (typeof txData.amount === 'object' && txData.amount && 'value' in txData.amount && 'unit' in txData.amount) {
              // Amount is already in the correct object format
              amount = txData.amount;
            } else {
              // Fallback - create amount from token
              amount = {
                value: "0",
                unit: txData.token
              };
            }

            dispatch(addTransaction({
              id: generateId(),
              counterParty: txData.counterParty,
              amount: amount,
              datetime: txData.datetime,
              txHash: txData.txHash,
              token: txData.token,
              blockNumber: txData.blockNumber,
              accountingPeriod: txData.accountingPeriod,
              direction: (txData.direction as "INFLOW" | "OUTFLOW") || "OUTFLOW", // Use direction from Alchemy data or default to OUTFLOW
              budget: null // No budget assigned initially
            }));
            addedCount++;
          }

          // Debug: Log the full document state to check direction values
          console.log(`[Editor] Full document state after adding transactions:`, JSON.stringify(document.state.global.transactions, null, 2));
          console.log(`[Editor] Direction values found:`, document.state.global.transactions.map(tx => `${tx.id.slice(0, 8)}... -> ${tx.direction}`));

          const skippedCount = result.transactions.length - addedCount;
          const message = skippedCount > 0
            ? `Successfully added ${addedCount} new transactions from Alchemy (${skippedCount} duplicates skipped)`
            : `Successfully added ${addedCount} new transactions from Alchemy`;

          alert(message);
          return;
        } else {
          throw new Error(result.message || "Failed to fetch transactions from Alchemy");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // If the new mutation doesn't exist, provide helpful message
        if (errorMessage.includes("400") || errorMessage.includes("Cannot query field")) {
          console.log("[Editor] New mutation not available, reactor needs restart");
          alert("The transaction fetching feature requires a reactor restart to work. Please restart the reactor (ph vetra) and try again.");
          return;
        }

        // Re-throw other errors
        throw error;
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert(`Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoadingTransactions(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DocumentToolbar document={document} onClose={handleClose} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DocumentHeader
            document={document}
            onNameChange={(name) => dispatch(setName(name))}
          />

          <AccountSection
            account={document.state.global.account}
            onSetAccount={(address, name) => {
              dispatch(setAccount({ address, name }));
            }}
          />

          <div className="mt-8">
            {viewMode === "list" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Transactions ({document.state.global.transactions.length})
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Manage account transactions with details and budgets. Only new transactions will be added when fetching.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleFetchTransactions}
                      disabled={isLoadingTransactions || !document.state.global.account?.account}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      {isLoadingTransactions ? "Fetching..." : "Fetch New Transactions"}
                    </Button>
                    <Button
                      onClick={() => setViewMode("add")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      Add Transaction
                    </Button>
                  </div>
                </div>

                <TransactionsTable
                  transactions={document.state.global.transactions}
                  budgets={document.state.global.budgets}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            )}

            {viewMode === "add" && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Add New Transaction
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Fill in the transaction details below
                  </p>
                </div>
                <TransactionForm
                  budgets={document.state.global.budgets}
                  onSubmit={handleAddTransaction}
                  onCancel={handleCancelForm}
                />
              </div>
            )}

            {viewMode === "edit" && editingTransaction && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Edit Transaction
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Update the transaction details below
                  </p>
                </div>
                <TransactionForm
                  transaction={editingTransaction}
                  budgets={document.state.global.budgets}
                  onSubmit={handleUpdateTransaction}
                  onCancel={handleCancelForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
