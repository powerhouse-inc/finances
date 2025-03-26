import { type EditorProps, hashKey } from "document-model";
import {
  type AccountsDocument,
  type AccountType,
  actions,
} from "../../document-models/accounts/index.js";
import { type AccountEntry as BaseAccountEntry } from "../../document-models/accounts/gen/types.js";
import { useState } from "react";

type AccountEntry = BaseAccountEntry & {
  chain?: string;
  accountTransactionsId?: string;
  owners?: string[];
};

export type IProps = EditorProps<AccountsDocument>;

export default function Editor(props: IProps) {
  const { document, dispatch } = props;
  const {
    state: { global: state },
  } = document;

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

  const handleCreateAccount = () => {
    console.log("Creating account:", newAccount);

    dispatch(
      actions.createAccount({
        id: hashKey(),
        ...newAccount,
      }),
    );
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

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Account Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>User Accounts</h2>
      </div>

      {/* Table Container */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px",
            minWidth: "1200px",
            gap: "16px",
            padding: "12px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
          }}
        >
          <div style={{ textAlign: "left" }}>Name</div>
          <div style={{ textAlign: "left" }}>Address</div>
          <div style={{ textAlign: "left" }}>Type</div>
          <div style={{ textAlign: "left" }}>Chain</div>
          <div style={{ textAlign: "left" }}>Budget Path</div>
          <div style={{ textAlign: "left" }}>Transactions ID</div>
          <div style={{ textAlign: "left" }}>Owners</div>
          <div style={{ textAlign: "left" }}>Actions</div>
        </div>

        {/* Table Body */}
        {state.accounts.map((account: AccountEntry) => (
          <div
            key={account.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px",
              minWidth: "1200px",
              gap: "16px",
              padding: "12px",
              borderBottom: "1px solid #eee",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "#007bff",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.name}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.account}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.type}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.chain}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.budgetPath}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.accountTransactionsId}
            </div>
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.owners?.join(", ")}
            </div>
            <button
              onClick={() =>
                dispatch(actions.deleteAccount({ id: account.id }))
              }
              style={{
                padding: "4px 8px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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
    </div>
  );
}
