import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import { Button } from "@powerhousedao/document-engineering";
import { setSelectedNode, useParentFolderForSelectedNode, useSelectedDrive, useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { useSelectedFinanceSnapshotDocument } from "../hooks/useFinanceSnapshotDocument.js";
import { snapshotIntegration } from "./snapshotIntegration.js";

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

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  async function handleGenerateSnapshot() {
    // Validate inputs
    if (!accountsDocumentId.trim()) {
      alert("Please enter an Accounts Document ID");
      return;
    }

    if (!owner.trim()) {
      alert("Please enter an owner");
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

    if (!document?.header?.id) {
      alert("Document ID not found");
      return;
    }

    setIsCreating(true);
    try {
      // Call the GraphQL resolver to generate the snapshot
      const result = await snapshotIntegration.generateSnapshotFromAccounts(
        document.header.id,
        accountsDocumentId,
        owner,
        periodStart,
        periodEnd,
      );

      if (result.success) {
        alert(
          `✅ ${result.message}\n\n` +
          `Accounts Processed: ${result.accountsProcessed}\n` +
          `Transactions Imported: ${result.transactionsImported}\n` +
          `Balances Calculated: ${result.balancesCalculated}`
        );

        // Clear form
        setAccountsDocumentId("");
        setPeriodStart("");
        setPeriodEnd("");
      } else {
        alert(`❌ Failed to create snapshot: ${result.message}`);
      }
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

          {/* Snapshot Balance Display */}
          {state?.id && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Snapshot Overview</h2>

              {/* Calculate totals for USDC */}
              {(() => {
                const usdcBalances = (state.balances || []).filter((b: any) => b.token === "USDC");
                const totalStarting = usdcBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.startingBalance?.value || "0"), 0
                );
                const totalEnding = usdcBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.endingBalance?.value || "0"), 0
                );
                const totalInflow = usdcBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.externalInflow?.value || "0"), 0
                );
                const totalOutflow = usdcBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.externalOutflow?.value || "0"), 0
                );
                const netChange = totalEnding - totalStarting;

                return (
                  <>
                    {/* Top Balance Flow */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {netChange >= 0 ? '+' : ''}{netChange.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Net Change</div>
                      </div>

                      <div className="grid grid-cols-4 gap-6 items-center">
                        {/* Initial Balance */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="text-xs text-gray-500 mb-2">
                            {state.periodStart ? new Date(state.periodStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">Initial Balance</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {totalStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400">USD</span>
                          </div>
                        </div>

                        {/* Inflow */}
                        <div className="text-center">
                          <div className="text-4xl text-gray-300 mb-2">+</div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">Inflow</div>
                            <div className="text-xl font-bold text-green-600">
                              {totalInflow.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-xs font-normal text-gray-400">USD</span>
                            </div>
                          </div>
                        </div>

                        {/* Outflow */}
                        <div className="text-center">
                          <div className="text-4xl text-gray-300 mb-2">−</div>
                          <div className="bg-red-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">Outflow</div>
                            <div className="text-xl font-bold text-red-600">
                              {totalOutflow.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-xs font-normal text-gray-400">USD</span>
                            </div>
                          </div>
                        </div>

                        {/* New Balance */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="text-xs text-gray-500 mb-2">
                            {state.periodEnd ? new Date(state.periodEnd).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">New Balance</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {totalEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400">USD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accounts Breakdown */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">View by Account</h3>
                      {(state.wallets || []).map((wallet: any) => {
                        const walletBalances = usdcBalances.filter((b: any) => b.walletAddress === wallet.address);
                        const walletTransactions = (state.transactions || []).filter((tx: any) =>
                          tx.fromWalletType || tx.toWalletType
                        );

                        const walletStarting = walletBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.startingBalance?.value || "0"), 0
                        );
                        const walletEnding = walletBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.endingBalance?.value || "0"), 0
                        );
                        const walletInflow = walletBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.externalInflow?.value || "0"), 0
                        );
                        const walletOutflow = walletBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.externalOutflow?.value || "0"), 0
                        );

                        return (
                          <details key={wallet.id} className="bg-white rounded-lg border border-gray-200">
                            <summary className="cursor-pointer p-4 hover:bg-gray-50 flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-900">{wallet.label}</div>
                                <div className="text-xs text-gray-500 font-mono">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</div>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <div className="text-right">
                                  <div className="text-gray-500">Starting</div>
                                  <div className="font-semibold">{walletStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-500">Ending</div>
                                  <div className="font-semibold">{walletEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-500">Change</div>
                                  <div className={`font-semibold ${(walletEnding - walletStarting) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {(walletEnding - walletStarting) >= 0 ? '+' : ''}{(walletEnding - walletStarting).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                                  </div>
                                </div>
                              </div>
                            </summary>
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Inflow</div>
                                  <div className="text-lg font-semibold text-green-600">
                                    +{walletInflow.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Outflow</div>
                                  <div className="text-lg font-semibold text-red-600">
                                    -{walletOutflow.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                                  </div>
                                </div>
                              </div>
                              {walletTransactions.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto">
                                  <table className="w-full text-xs">
                                    <thead className="bg-gray-100 sticky top-0">
                                      <tr>
                                        <th className="text-left p-2">Date</th>
                                        <th className="text-left p-2">Type</th>
                                        <th className="text-left p-2">Token</th>
                                        <th className="text-right p-2">Amount</th>
                                        <th className="text-left p-2">Counter Party</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {walletTransactions.slice(0, 10).map((tx: any) => (
                                        <tr key={tx.id} className="border-t border-gray-200">
                                          <td className="p-2">{new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                          <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                              tx.flowType === 'EXTERNAL_INFLOW' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                              {tx.flowType === 'EXTERNAL_INFLOW' ? 'In' : 'Out'}
                                            </span>
                                          </td>
                                          <td className="p-2">{tx.token}</td>
                                          <td className="p-2 text-right font-mono">{parseFloat(tx.amount?.value || "0").toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                          <td className="p-2 font-mono text-xs">{tx.counterParty?.slice(0, 8)}...{tx.counterParty?.slice(-6)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {walletTransactions.length > 10 && (
                                    <div className="text-center text-xs text-gray-500 mt-2">
                                      Showing 10 of {walletTransactions.length} transactions
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-sm text-gray-500 py-4">No transactions in this period</div>
                              )}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <details className="mb-6">
            <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900">
              Debug: Raw Document State
            </summary>
            <pre className="bg-gray-100 p-4 text-xs rounded mt-4 overflow-auto max-h-96">
              {JSON.stringify(state, null, 2)}
            </pre>
          </details>

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