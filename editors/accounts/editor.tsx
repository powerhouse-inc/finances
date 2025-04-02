import { type EditorProps, hashKey } from "document-model";
import {
  type AccountsDocument,
  type AccountType,
  actions,
} from "../../document-models/accounts/index.js";
import { type AccountEntry as BaseAccountEntry } from "../../document-models/accounts/gen/types.js";
import { useState, useEffect, useRef } from "react";
import {
  createDocument,
  createAccount,
  updateAccount,
  deleteAccount,
} from "./gaphQL-operations.js";
import { client } from "./apollo-client.js";
import { client as accountTransactionsClient } from "../account-transactions/apollo-client.js";
import {
  createDocument as createAccountTransactionsDocument,
  importTransactions,
  updateAccount as updateAccountTransactions,
} from "../account-transactions/graphQL-operations.js";
import { getTransactionDocument } from "../utils/financesDriveClient.js";
import TransactionsTable from "../account-transactions/TransactionsTable.js";
import { toast, ToastContainer } from "@powerhousedao/design-system";

type AccountEntry = BaseAccountEntry;

export type IProps = EditorProps<any>;

export default function Editor(props: IProps) {
  const { document: doc, dispatch } = props;
  const {
    state: { global: state },
  } = doc;

  const [newAccount, setNewAccount] = useState<{
    name: string;
    account: string;
    budgetPath: string;
    type: AccountType;
    chain: string;
    accountTransactionsId: string;
    owners: string[];
  }>({
    name: "",
    account: "",
    budgetPath: "",
    type: "Protocol",
    chain: "",
    accountTransactionsId: "",
    owners: [],
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    accountId: string;
    field: keyof AccountEntry;
    value: string;
  } | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const transactionsTableRef = useRef<HTMLDivElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [onShowTransactionsTable, setOnShowTransactionsTable] = useState(false);
  const [transactionDocument, setTransactionDocument] = useState<any>(null);
  const [accountName, setAccountName] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        transactionsTableRef.current &&
        !transactionsTableRef.current.contains(event.target as Node)
      ) {
        setSelectedRowId(null);
        setOnShowTransactionsTable(false);
      }
    };

    window.document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateAccount = async () => {
    console.log("Creating account:", newAccount);

    // dispatch(
    //   actions.createAccount({
    //     id: hashKey(),
    //     ...newAccount,
    //   })
    // );
    const createdAccount = await createAccount(
      client,
      doc.documentId,
      { ...newAccount, id: hashKey() },
      doc.driveId
    );
    console.log("createdAccount", createdAccount);
    setNewAccount({
      name: "",
      account: "",
      budgetPath: "",
      type: "Protocol",
      chain: "",
      accountTransactionsId: "",
      owners: [],
    });
  };

  const handleCellEdit = (
    account: AccountEntry,
    field: keyof AccountEntry,
    value: string
  ) => {
    setEditingCell({ accountId: account.id, field, value });
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    const { accountId, field, value } = editingCell;
    // dispatch(
    //   actions.updateAccount({
    //     id: accountId,
    //     [field]: value,
    //   })
    // );
    const result = await updateAccount(
      client,
      doc.documentId,
      {
        id: accountId,
        [field]: value,
      },
      doc.driveId
    );
    console.log("returned updateAccount value", result);
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  const handleCellBlur = (originalValue: string | null | undefined) => {
    if (!editingCell) return;

    // Only update if the value has changed
    if (editingCell.value !== (originalValue || "")) {
      handleCellSave();
    } else {
      handleCellCancel();
    }
  };

  const trackTransactions = async () => {
    console.log("Tracking transactions");
    const accountAddresses = state.accounts.map((account: AccountEntry) => {
      return {
        address: account.account,
        name: account.name,
      };
    });
    console.log("accountAddresses", accountAddresses);
    if (accountAddresses.length === 0) {
      console.log("No accounts to track");
      return;
    }
    // Create account transactions document for each account and import transactions
    const accountTransactionsDocuments = await Promise.all(
      accountAddresses.map(
        async (account: { address: string; name: string }) => {
          // Create account transactions document
          const accountTransactionsDocument =
            await createAccountTransactionsDocument(
              accountTransactionsClient,
              account.name,
              doc.driveId
            );

          // Add transaction document id to account
          await addTransactionDocumentIdToAccount(
            account.address,
            accountTransactionsDocument
          );

          // Set counterparty address
          await updateAccountTransactions(
            accountTransactionsClient,
            accountTransactionsDocument,
            {
              account: account.address,
            }
          );

          // Import transactions
          const result = await importTransactions(
            accountTransactionsClient,
            accountTransactionsDocument,
            { addresses: [account.address] },
            doc.driveId
          );

          // Add transaction document id to account
          return result;
        }
      )
    );
    console.log(
      "created and imported transactions",
      accountTransactionsDocuments
    );
    toast("Transactions tracked", {
      type: "success",
    });
  };

  const addTransactionDocumentIdToAccount = async (
    address: string,
    transactionDocumentId: string
  ) => {
    const account = state.accounts.find(
      (account: AccountEntry) => account.account === address
    );
    if (!account) {
      console.log("Account not found");
      return;
    }
    await updateAccount(
      client,
      doc.documentId,
      {
        id: account.id,
        accountTransactionsId: transactionDocumentId,
      },
      doc.driveId
    );
  };

  const handleRowClick = async (accountId: string) => {
    setSelectedRowId(accountId);
    const account = state.accounts.find(
      (account: AccountEntry) => account.id === accountId
    );
    setAccountName(account?.name);
    if (!account?.accountTransactionsId) {
      setOnShowTransactionsTable(false);
      return;
    }

    try {
      const transactionDocument = await getTransactionDocument(
        account.accountTransactionsId
      );
      setTransactionDocument(transactionDocument);
      setOnShowTransactionsTable(true);
    } catch (error) {
      console.error("Error fetching transaction document:", error);
      setOnShowTransactionsTable(false);
    }
  };

  const renderEditableCell = (
    account: AccountEntry,
    field: keyof AccountEntry,
    value: string | null | undefined
  ) => {
    const isEditing =
      editingCell?.accountId === account.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <input
          type="text"
          value={editingCell.value}
          onChange={(e) =>
            setEditingCell({ ...editingCell, value: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCellBlur(value);
            if (e.key === "Escape") handleCellCancel();
          }}
          onBlur={() => handleCellBlur(value)}
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => handleCellEdit(account, field, value || "")}
        style={{
          textAlign: "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {value || ""}
      </div>
    );
  };

  const handleDeleteAccount = async (accountId: string) => {
    const result = await deleteAccount(
      client,
      doc.documentId,
      { id: accountId },
      doc.driveId
    );
    console.log("returned deleteAccount value", result);
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Account Management</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => trackTransactions()}
            style={{
              padding: "8px 16px",
              backgroundColor: "grey",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Track Transactions
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Create Account
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>User Accounts</h2>
      </div>

      {/* Table Container */}
      <div
        ref={tableRef}
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px",
            minWidth: "1200px",
            gap: "8px",
            padding: "8px 4px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div style={{ textAlign: "center" }}>ID</div>
          <div style={{ textAlign: "center" }}>Name</div>
          <div style={{ textAlign: "center" }}>Address</div>
          <div style={{ textAlign: "center" }}>Type</div>
          <div style={{ textAlign: "center" }}>Chain</div>
          <div style={{ textAlign: "center" }}>Budget Path</div>
          <div style={{ textAlign: "center" }}>Transactions ID</div>
          <div style={{ textAlign: "center" }}>Owners</div>
          <div style={{ textAlign: "center" }}>Actions</div>
        </div>

        {/* Table Body */}
        {state.accounts.map((account: AccountEntry, index: number) => (
          <div
            key={account.id}
            onClick={() => handleRowClick(account.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px",
              minWidth: "1200px",
              gap: "8px",
              padding: "8px 4px",
              borderBottom: "1px solid #eee",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor:
                selectedRowId === account.id ? "#e3f2fd" : "transparent",
              transition: "background-color 0.2s ease",
            }}
          >
            <div style={{ textAlign: "center" }}>{index + 1}</div>
            {renderEditableCell(account, "name", account.name)}
            {renderEditableCell(account, "account", account.account)}
            {renderEditableCell(account, "type", account.type)}
            {renderEditableCell(account, "chain", account.chain)}
            {renderEditableCell(account, "budgetPath", account.budgetPath)}
            {renderEditableCell(
              account,
              "accountTransactionsId",
              account.accountTransactionsId
            )}
            {renderEditableCell(account, "owners", account.owners?.join(", "))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAccount(account.id);
              }}
              style={{
                padding: "4px 8px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "80px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Create Account Modal */}
      {showCreateForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "8px",
              width: "500px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2>Add new account</h2>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Account name
                </label>
                <input
                  type="text"
                  placeholder="Add account name"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Ethereum Address
                </label>
                <input
                  type="text"
                  placeholder="ENS or address"
                  value={newAccount.account}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, account: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Chain
                </label>
                <input
                  type="text"
                  placeholder="Enter chain"
                  value={newAccount.chain}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, chain: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Budget Path
                </label>
                <input
                  type="text"
                  placeholder="/path"
                  value={newAccount.budgetPath}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, budgetPath: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Owners
                </label>
                <input
                  type="text"
                  placeholder="Enter owners (comma-separated)"
                  value={newAccount.owners.join(", ")}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      owners: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      type: e.target.value as AccountType,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="Protocol">Protocol</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Operational">Operational</option>
                  <option value="Payment Processor">Payment Processor</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#fff",
                    color: "#2E3338",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleCreateAccount();
                    setShowCreateForm(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#2E3338",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {onShowTransactionsTable && (
        <div
          ref={transactionsTableRef}
          style={{
            marginTop: "20px",
            backgroundColor: "white",
            padding: "16px",
            flex: 1,
          }}
        >
          <div>
            <h2>{accountName} Account Transactions</h2>
          </div>
          <div>
            <TransactionsTable
              account={transactionDocument.state.account}
              transactions={transactionDocument.state.transactions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
