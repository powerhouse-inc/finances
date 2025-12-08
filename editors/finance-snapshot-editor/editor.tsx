import { useCallback, useMemo, useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import { Button, PHIDInput } from "@powerhousedao/document-engineering";
import { setSelectedNode, useParentFolderForSelectedNode, useSelectedDrive, useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { useSelectedFinanceSnapshotDocument } from "../hooks/useFinanceSnapshotDocument.js";
import { snapshotIntegration } from "./snapshotIntegration.js";
import { DocumentHeader } from "./components/DocumentHeader.js";

export function Editor() {
  const [document, dispatch] = useSelectedFinanceSnapshotDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const [accountsDocumentId, setAccountsDocumentId] = useState("");
  const [owner, setOwner] = useState("Portfolio Team");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const selectedDrive = useSelectedDrive();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const accountDocuments = (documentsInDrive || []).filter(
    (doc: any) => doc?.header?.documentType === "powerhouse/accounts",
  );
  const selectedAccountDoc = accountDocuments.find(
    (doc: any) => doc?.header?.id === accountsDocumentId,
  );

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
          {/* Document Header */}
          {document && (
            <DocumentHeader
              document={document as any}
              onNameChange={(name) => dispatch(setName(name))}
            />
          )}

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
                  Accounts Document
                </label>
                <PHIDInput
                  id="accountsDocumentId"
                  autoComplete
                  allowUris={false}
                  value={accountsDocumentId}
                  placeholder="Select or paste Accounts document PHID..."
                  variant="withValueAndTitle"
                  fetchOptionsCallback={useCallback(
                    async (userInput: string) => {
                      const query = (userInput || "").toLowerCase();
                      return accountDocuments
                        .filter((doc: any) => {
                          const name = (doc.header?.name || "").toLowerCase();
                          const id = (doc.header?.id || "").toLowerCase();
                          return !query || name.includes(query) || id.includes(query);
                        })
                        .map((doc: any) => ({
                          value: doc.header.id,
                          title: doc.header.name || doc.header.id, // show document name in the bar
                          description: doc.header.documentType || "Type not available", // show type
                          path: { text: doc.header.id, url: "" }, // show ID beneath
                        }));
                    },
                    [accountDocuments],
                  )}
                  fetchSelectedOptionCallback={useCallback(
                    async (value: string) => {
                      if (!value) return undefined;
                      const doc = accountDocuments.find((d: any) => d?.header?.id === value);
                      if (doc) {
                        return {
                          value: doc.header.id,
                          title: doc.header.name || doc.header.id,
                          description: doc.header.documentType || "Type not available",
                          path: { text: doc.header.id, url: "" },
                        };
                      }
                      // fallback when pasted PHID not in drive
                      return {
                        value,
                        title: value,
                        description: "Type not available",
                        path: { text: value, url: "" },
                      };
                    },
                    [accountDocuments],
                  )}
                  onChange={(val) => setAccountsDocumentId(val || "")}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {accountDocuments.length > 0
                    ? `Found ${accountDocuments.length} Accounts document${accountDocuments.length === 1 ? "" : "s"} in this drive.`
                    : "No Accounts documents found in this drive. You can still paste a PHID."}
                </p>
                {selectedAccountDoc && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {selectedAccountDoc.header.name || selectedAccountDoc.header.id} ({selectedAccountDoc.header.id})
                  </p>
                )}
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

              {/* Calculate totals for SKY and USDS */}
              {(() => {
                const skyUsdsBalances = (state.balances || []).filter((b: any) => b.token === "SKY" || b.token === "USDS");
                const skyBalances = skyUsdsBalances.filter((b: any) => b.token === "SKY");
                const usdsBalances = skyUsdsBalances.filter((b: any) => b.token === "USDS");

                // Calculate totals for SKY
                const skyStarting = skyBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.startingBalance?.value || "0"), 0
                );
                const skyEnding = skyBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.endingBalance?.value || "0"), 0
                );

                // Calculate totals for USDS
                const usdsStarting = usdsBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.startingBalance?.value || "0"), 0
                );
                const usdsEnding = usdsBalances.reduce((sum: number, b: any) =>
                  sum + parseFloat(b.endingBalance?.value || "0"), 0
                );

                return (
                  <>
                    {/* SKY and USDS Balance Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* SKY Balance Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SKY</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">
                              {state.periodStart ? new Date(state.periodStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Starting Balance</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {skyStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">
                              {state.periodEnd ? new Date(state.periodEnd).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Ending Balance</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {skyEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* USDS Balance Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">USDS</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">
                              {state.periodStart ? new Date(state.periodStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Starting Balance</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {usdsStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">
                              {state.periodEnd ? new Date(state.periodEnd).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Ending Balance</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {usdsEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accounts Breakdown */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">View by Account</h3>
                      {(state.wallets || []).map((wallet: any) => {
                        const walletBalances = skyUsdsBalances.filter((b: any) => b.walletAddress === wallet.address);
                        const walletSkyBalances = walletBalances.filter((b: any) => b.token === "SKY");
                        const walletUsdsBalances = walletBalances.filter((b: any) => b.token === "USDS");

                        const walletSkyStarting = walletSkyBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.startingBalance?.value || "0"), 0
                        );
                        const walletSkyEnding = walletSkyBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.endingBalance?.value || "0"), 0
                        );
                        const walletUsdsStarting = walletUsdsBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.startingBalance?.value || "0"), 0
                        );
                        const walletUsdsEnding = walletUsdsBalances.reduce((sum: number, b: any) =>
                          sum + parseFloat(b.endingBalance?.value || "0"), 0
                        );

                        // Only show wallet if it has SKY or USDS balances
                        if (walletBalances.length === 0) return null;

                        return (
                          <details key={wallet.id} className="bg-white rounded-lg border border-gray-200">
                            <summary className="cursor-pointer p-4 hover:bg-gray-50 flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-900">{wallet.label}</div>
                                <div className="text-xs text-gray-500 font-mono">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</div>
                              </div>
                              <div className="flex gap-4 text-sm">
                                {walletSkyBalances.length > 0 && (
                                  <div className="text-right">
                                    <div className="text-gray-500">SKY Starting</div>
                                    <div className="font-semibold">{walletSkyStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                    <div className="text-gray-500 mt-1">SKY Ending</div>
                                    <div className="font-semibold">{walletSkyEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                  </div>
                                )}
                                {walletUsdsBalances.length > 0 && (
                                  <div className="text-right">
                                    <div className="text-gray-500">USDS Starting</div>
                                    <div className="font-semibold">{walletUsdsStarting.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                    <div className="text-gray-500 mt-1">USDS Ending</div>
                                    <div className="font-semibold">{walletUsdsEnding.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                  </div>
                                )}
                              </div>
                            </summary>
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                              <div className="text-center text-sm text-gray-500 py-4">Balance details for SKY and USDS</div>
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

          {/* Debug section removed per request */}
        </div>
      </div>
    </div>
  );
}