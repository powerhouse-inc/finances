import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import { Button } from "@powerhousedao/document-engineering";
import { setSelectedNode, useParentFolderForSelectedNode, useSelectedDrive, useDocumentById, useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { generateId } from "document-model/core";
import { useSelectedFinanceSnapshotDocument } from "../hooks/useFinanceSnapshotDocument.js";
import { createSnapshot, initializeFromAccounts, addTransaction, updateWalletBalance } from "../../document-models/finance-snapshot/gen/creators.js";
import type { AccountEntry } from "../../document-models/accounts/gen/schema/types.js";
import type { AccountTypeInput, TransactionFlowTypeInput } from "../../document-models/finance-snapshot/gen/schema/types.js";

export function Editor() {
  const [document, dispatch] = useSelectedFinanceSnapshotDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const selectedDrive = useSelectedDrive();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [accountsDocumentId, setAccountsDocumentId] = useState("");
  const [owner, setOwner] = useState("Portfolio Team");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Try to get the Accounts document if accountsDocumentId is provided
  const accountsDocument = useDocumentById(accountsDocumentId || null);

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  async function handleGenerateSnapshot() {
    // Validate inputs
    if (!accountsDocumentId.trim()) {
      alert("Please enter an Accounts Document ID");
      return;
    }

    if (!periodStart || !periodEnd) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(periodStart) > new Date(periodEnd)) {
      alert("Start date must be before end date");
      return;
    }

    setIsCreating(true);
    try {
      // Find the Accounts document
      const foundDocument = documentsInDrive?.find(doc => doc?.header?.id === accountsDocumentId);

      if (!foundDocument) {
        alert("Accounts document not found. Please check the document ID.");
        setIsCreating(false);
        return;
      }

      // Validate document type
      const documentType = foundDocument?.header?.documentType;
      if (documentType !== "powerhouse/accounts") {
        alert(`Invalid document type: ${documentType}. Expected "powerhouse/accounts".`);
        setIsCreating(false);
        return;
      }

      // Get accounts from the document
      const accountsState = (foundDocument?.state as any)?.global;
      const accounts: AccountEntry[] = accountsState?.accounts || [];

      if (accounts.length === 0) {
        alert("No accounts found in the Accounts document.");
        setIsCreating(false);
        return;
      }

      // Check that all accounts have transaction files
      const accountsWithoutTransactions = accounts.filter(acc => !acc.accountTransactionsId);
      if (accountsWithoutTransactions.length > 0) {
        const missingNames = accountsWithoutTransactions.map(acc => acc.name || acc.account).join(", ");
        alert(`❌ Cannot create snapshot: The following accounts do not have transaction files:\n\n${missingNames}\n\nAll accounts must have transaction files before creating a snapshot.`);
        setIsCreating(false);
        return;
      }

      // Create the snapshot
      const snapshotId = generateId();
      const now = new Date().toISOString();
      const startDate = new Date(periodStart).toISOString();
      const endDate = new Date(periodEnd).toISOString();
      const period = `${periodStart} to ${periodEnd}`;

      // First create the basic snapshot
      dispatch(createSnapshot({
        id: snapshotId,
        name: `Snapshot ${period}`,
        period: period,
        periodStart: startDate,
        periodEnd: endDate,
        owner: owner,
        created: now,
        accountsDocumentId: accountsDocumentId,
      }));

      // Define the main tokens to track
      const tokens = ["USDC", "USDT", "USDS", "DAI", "MKR", "SKY", "ETH", "WETH"];

      // Prepare accounts data for initialization
      const accountInputs = accounts.map(acc => ({
        id: acc.id,
        address: acc.account,
        name: acc.name,
        accountType: (acc.type || "Protocol") as AccountTypeInput,
        accountTransactionsId: acc.accountTransactionsId!,
      }));

      // Initialize from accounts (creates wallets and balances)
      dispatch(initializeFromAccounts({
        accountsDocumentId: accountsDocumentId,
        accounts: accountInputs,
        tokens: tokens,
      }));

      // Now fetch transactions and calculate balances for each account
      const periodStartDate = new Date(startDate);
      const periodEndDate = new Date(endDate);
      let totalTransactions = 0;

      // Track starting balances (from transactions before period)
      const startingBalancesByWalletToken = new Map<string, bigint>();

      // Track period balances
      const balancesByWalletToken = new Map<string, {
        wallet: string;
        token: string;
        accountType: AccountTypeInput;
        inflows: bigint;
        outflows: bigint;
        internalInflows: bigint;
        internalOutflows: bigint;
      }>();

      for (const account of accounts) {
        // Fetch the AccountTransactions document
        const txnsDocument = documentsInDrive?.find(doc => doc?.header?.id === account.accountTransactionsId);

        if (!txnsDocument) {
          console.warn(`Transactions document not found for account ${account.name}`);
          continue;
        }

        const txnsState = (txnsDocument?.state as any)?.global;
        const transactions = txnsState?.transactions || [];

        // Calculate starting balances from transactions BEFORE the period
        const historicalTransactions = transactions.filter((tx: any) => {
          const txDate = new Date(tx.datetime);
          return txDate < periodStartDate;
        });

        for (const tx of historicalTransactions) {
          const token = tx.details?.token || "ETH";
          const balanceKey = `${account.account}-${token}`;
          const isInflow = tx.type === "Inflow";
          const amountValue = BigInt(Math.floor(parseFloat(tx.amount.value) * 1e18));

          if (!startingBalancesByWalletToken.has(balanceKey)) {
            startingBalancesByWalletToken.set(balanceKey, 0n);
          }

          const currentBalance = startingBalancesByWalletToken.get(balanceKey)!;
          if (isInflow) {
            startingBalancesByWalletToken.set(balanceKey, currentBalance + amountValue);
          } else {
            startingBalancesByWalletToken.set(balanceKey, currentBalance - amountValue);
          }
        }

        // Filter transactions by period
        const periodTransactions = transactions.filter((tx: any) => {
          const txDate = new Date(tx.datetime);
          return txDate >= periodStartDate && txDate <= periodEndDate;
        });

        // Add transactions to snapshot
        for (const tx of periodTransactions) {
          const txId = generateId();
          const token = tx.details?.token || "ETH";
          const amount = tx.amount;
          const isInflow = tx.type === "Inflow";

          // Determine flow type
          let flowType: TransactionFlowTypeInput = "EXTERNAL_OUTFLOW";
          if (isInflow) {
            flowType = "EXTERNAL_INFLOW";
          }

          dispatch(addTransaction({
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
            fromWalletType: isInflow ? null : (account.type || "Protocol") as AccountTypeInput,
            toWalletType: isInflow ? (account.type || "Protocol") as AccountTypeInput : null,
          }));

          totalTransactions++;

          // Track balances
          const balanceKey = `${account.account}-${token}`;
          if (!balancesByWalletToken.has(balanceKey)) {
            balancesByWalletToken.set(balanceKey, {
              wallet: account.account,
              token: token,
              accountType: (account.type || "Protocol") as AccountTypeInput,
              inflows: 0n,
              outflows: 0n,
              internalInflows: 0n,
              internalOutflows: 0n,
            });
          }

          const balance = balancesByWalletToken.get(balanceKey)!;
          const amountValue = BigInt(Math.floor(parseFloat(amount.value) * 1e18));

          if (isInflow) {
            balance.inflows += amountValue;
          } else {
            balance.outflows += amountValue;
          }
        }
      }

      // Update balances for all wallet × token combinations that had activity in the period
      for (const [key, balanceData] of balancesByWalletToken.entries()) {
        const balanceId = key;
        const netChange = balanceData.inflows - balanceData.outflows;
        const startingBalance = startingBalancesByWalletToken.get(key) || 0n;
        const endingBalance = startingBalance + netChange;

        const formatAmount = (value: bigint, unit: string) => ({
          value: (Number(value) / 1e18).toFixed(6),
          unit: unit,
        });

        dispatch(updateWalletBalance({
          id: balanceId,
          walletAddress: balanceData.wallet,
          accountType: balanceData.accountType,
          token: balanceData.token,
          startingBalance: formatAmount(startingBalance, balanceData.token),
          endingBalance: formatAmount(endingBalance, balanceData.token),
          externalInflow: formatAmount(balanceData.inflows, balanceData.token),
          externalOutflow: formatAmount(balanceData.outflows, balanceData.token),
          internalInflow: formatAmount(balanceData.internalInflows, balanceData.token),
          internalOutflow: formatAmount(balanceData.internalOutflows, balanceData.token),
          netExternalChange: formatAmount(netChange, balanceData.token),
        }));
      }

      // Also update balances for tokens that had starting balance but no activity in the period
      for (const [key, startingBalance] of startingBalancesByWalletToken.entries()) {
        if (!balancesByWalletToken.has(key)) {
          // This token had balance before the period but no transactions during the period
          const [walletAddress, token] = key.split('-');
          const account = accounts.find(acc => acc.account === walletAddress);

          if (account) {
            const formatAmount = (value: bigint, unit: string) => ({
              value: (Number(value) / 1e18).toFixed(6),
              unit: unit,
            });

            dispatch(updateWalletBalance({
              id: key,
              walletAddress: walletAddress,
              accountType: (account.type || "Protocol") as AccountTypeInput,
              token: token,
              startingBalance: formatAmount(startingBalance, token),
              endingBalance: formatAmount(startingBalance, token), // No change
              externalInflow: formatAmount(0n, token),
              externalOutflow: formatAmount(0n, token),
              internalInflow: formatAmount(0n, token),
              internalOutflow: formatAmount(0n, token),
              netExternalChange: formatAmount(0n, token),
            }));
          }
        }
      }

      alert(`✅ Snapshot created successfully!\n\nInitialized:\n- ${accounts.length} accounts/wallets\n- ${totalTransactions} transactions imported\n- ${balancesByWalletToken.size} balances calculated\n\nPeriod: ${period}`);

      // Clear form
      setAccountsDocumentId("");
      setPeriodStart("");
      setPeriodEnd("");
    } catch (error) {
      console.error("Error creating snapshot:", error);
      alert("❌ Failed to create snapshot: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreating(false);
    }
  }

  const state = (document?.state as any)?.global || {};
  const header = document?.header || {};

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DocumentToolbar document={document} onClose={handleClose} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Snapshot</h1>
            <input
              type="text"
              value={document?.header?.name || "Untitled Snapshot"}
              onChange={(e) => dispatch(setName(e.target.value))}
              className="text-lg text-gray-600 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 px-2 py-1 rounded"
              placeholder="Enter document name..."
            />
          </div>

          {/* Create Snapshot Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Snapshot from Accounts</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-2">
                  Owner
                </label>
                <input
                  id="owner"
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Portfolio Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="accountsDocumentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Accounts Document ID
                </label>
                <input
                  id="accountsDocumentId"
                  type="text"
                  value={accountsDocumentId}
                  onChange={(e) => setAccountsDocumentId(e.target.value)}
                  placeholder="Enter Accounts document ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="periodStart" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="periodStart"
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="periodEnd" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="periodEnd"
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateSnapshot}
                disabled={isCreating || !accountsDocumentId.trim() || !owner.trim() || !periodStart || !periodEnd}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Generating..." : "Generate Snapshot"}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              This will validate that all accounts have transaction files and create a snapshot with wallets and balance entries for the specified period.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Document State (Snapshot Content):</h2>
          <pre className="bg-gray-100 p-4 text-xs rounded mb-6 overflow-auto max-h-96">
            {JSON.stringify(state, null, 2)}
          </pre>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h3 className="font-medium text-gray-900 mb-2">Document Info:</h3>
            <p><strong>Header ID:</strong> {(header as any)?.id || 'N/A'} (Document instance ID)</p>
            <p><strong>State ID:</strong> {state?.id || 'null'} (Snapshot content ID)</p>
            <p><strong>Current Drive:</strong> {(selectedDrive as any)?.[0]?.state?.global?.name || 'Unknown'} (ID: {(selectedDrive as any)?.[0]?.header?.id || 'N/A'})</p>
            <p><strong>Documents in Drive:</strong> {documentsInDrive?.length || 0} documents</p>
            {documentsInDrive && documentsInDrive.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Available Documents in Drive</summary>
                <div className="mt-2 pl-4">
                  {documentsInDrive.map((doc, index) => (
                    <div key={index} className="text-sm mb-1">
                      <strong>ID:</strong> {doc?.header?.id} | <strong>Type:</strong> {doc?.header?.documentType} | <strong>Name:</strong> {doc?.header?.name || 'Untitled'}
                    </div>
                  ))}
                </div>
              </details>
            )}
            <p><strong>Status:</strong> {state?.id ? 'Snapshot has been created!' : 'No snapshot created yet - state is empty'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}