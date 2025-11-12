import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import { Button } from "@powerhousedao/document-engineering";
import { setSelectedNode, useParentFolderForSelectedNode, useSelectedDrive, useDocumentById, useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { useSelectedFinanceSnapshotDocument } from "../hooks/useFinanceSnapshotDocument.js";
import { createSnapshot, addWallet, addTransaction } from "../../document-models/finance-snapshot/gen/creators.js";

export function Editor() {
  const [document, dispatch] = useSelectedFinanceSnapshotDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const selectedDrive = useSelectedDrive();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [documentId, setDocumentId] = useState("");
  const [owner, setOwner] = useState("Portfolio Team");
  const [isCreating, setIsCreating] = useState(false);

  // Try to get the document if documentId is provided
  const targetDocument = useDocumentById(documentId || null);

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  async function handleCreateSnapshot() {
    if (!documentId.trim()) {
      alert("Please enter a document ID");
      return;
    }

    setIsCreating(true);
    try {
      // First, try to fetch and validate the document type
      let sourceDocument = null;
      let documentType = null;

      // Try to fetch the document to check its type
      // First try from documents in selected drive, then fallback to localStorage
      console.log(`Attempting to fetch document: ${documentId} from drive: ${(selectedDrive as any)?.[0]?.header?.id}`);
      console.log(`Documents in drive:`, documentsInDrive?.map(d => ({ id: d?.header?.id, type: d?.header?.documentType })));

      // Try to find document in the current drive's documents
      const foundDocument = documentsInDrive?.find(doc => doc?.header?.id === documentId);
      if (foundDocument) {
        console.log("Document found in current drive");
        sourceDocument = foundDocument;
        documentType = sourceDocument?.header?.documentType;
      } else {
        console.log("Document not found in current drive, trying localStorage...");
        try {
          const localDoc = localStorage.getItem(`document-${documentId}`);
          if (localDoc) {
            console.log("Document found in localStorage");
            sourceDocument = JSON.parse(localDoc);
            documentType = sourceDocument?.header?.documentType;
          }
        } catch (storageError) {
          console.log("localStorage access failed", storageError);
        }
      }

      // Validate document type
      if (!sourceDocument) {
        alert("Document not found. Please check the document ID.");
        return;
      }

      if (documentType !== "powerhouse/account-transactions") {
        alert(`Invalid document type: ${documentType}. Expected "powerhouse/account-transactions".`);
        return;
      }

      // Document is valid, proceed with snapshot creation
      const snapshotId = Date.now().toString();
      const now = new Date().toISOString();
      const accountState = sourceDocument?.state?.global;

      // Create the basic snapshot
      dispatch(createSnapshot({
        id: snapshotId,
        name: `Snapshot from ${documentId}`,
        period: "Full Period",
        periodStart: "2020-01-01T00:00:00.000Z",
        periodEnd: now,
        owner: owner,
        created: now,
      }));

      // Add wallet and transactions if available
      if (accountState) {
        // Add the wallet from the account
        if (accountState.account?.account) {
          const walletId = Date.now().toString() + "_wallet";
          dispatch(addWallet({
            id: walletId,
            address: accountState.account.account,
            accountType: "Operational",
            label: accountState.account.name || accountState.account.account,
            accountTransactionsRef: documentId,
          }));
        }

        // Add all transactions
        if (accountState.transactions && Array.isArray(accountState.transactions)) {
          accountState.transactions.forEach((tx: any, index: number) => {
            const txId = `${snapshotId}_tx_${index}`;
            dispatch(addTransaction({
              id: txId,
              block: tx.details?.blockNumber || null,
              timestamp: tx.datetime,
              txHash: tx.details?.txHash || "",
              token: tx.details?.token || "ETH",
              counterParty: tx.counterParty,
              amount: tx.amount,
              txLabel: null,
              counterPartyName: null,
              flowType: "EXTERNAL_OUTFLOW",
              fromWalletType: "Operational",
              toWalletType: null,
            }));
          });

          alert(`✅ Snapshot created successfully!\n\nImported:\n- 1 wallet (${accountState.account?.account})\n- ${accountState.transactions.length} transactions`);
        } else {
          alert("✅ Snapshot created with wallet info, but no transactions found in source document.");
        }
      } else {
        alert("✅ Basic snapshot created, but no account data found in source document.");
      }

      setDocumentId("");
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Snapshot from Account Transactions</h3>

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
                  placeholder="Enter owner name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Transactions Document ID
                </label>
                <input
                  id="documentId"
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="Enter document ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateSnapshot}
                disabled={isCreating || !documentId.trim() || !owner.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Snapshot"}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              This will fetch the account transactions document and create a snapshot with all wallets and transactions.
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