import { type EditorProps, hashKey } from "document-model";
import {
  type AccountTransactionsDocument,
  actions,
} from "../../document-models/account-transactions/index.js";
import { useState, useEffect } from "react";
import { Button } from "@powerhousedao/design-system";
import { client } from "./apollo-client.js";
import {
  createTransaction,
  updateAccount,
  deleteTransaction,
  importTransactions,
} from "./graphQL-operations.js";

export type IProps = EditorProps<any>;

export default function Editor(props: IProps) {
  const { document, dispatch } = props;
  const { state } = document;
  const transactions = state.global?.transactions || [];
  const account = state.global?.account;
  console.log('Transactions Account', account?.username);

  const [hasEditedAccount, setHasEditedAccount] = useState(false);
  const [newUsername, setNewUsername] = useState(account?.username || "");
  const [showImportModal, setShowImportModal] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState("");

  const [newTransaction, setNewTransaction] = useState({
    counterParty: "",
    amount: "",
    details: {
      txHash: "",
      token: "",
      blockNumber: "",
    },
  });

  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // dispatch(
      //   actions.createTransaction({
      //     counterParty: newTransaction.counterParty,
      //     amount: parseFloat(newTransaction.amount),
      //     datetime: new Date().toISOString(),
      //     details: {
      //       txHash: newTransaction.details.txHash,
      //       token: newTransaction.details.token,
      //       blockNumber: parseInt(newTransaction.details.blockNumber) || null,
      //     },
      //   })
      // );
      const createdTransaction = await createTransaction(
        client,
        document.documentId,
        {
          counterParty: newTransaction.counterParty,
          amount: parseFloat(newTransaction.amount),
          datetime: new Date().toISOString(),
          details: {
            txHash: newTransaction.details.txHash,
            token: newTransaction.details.token,
            blockNumber: parseInt(newTransaction.details.blockNumber),
          },
        }
      );
      console.log("createdTransaction", createdTransaction);

      setNewTransaction({
        counterParty: "",
        amount: "",
        details: {
          txHash: "",
          token: "",
          blockNumber: "",
        },
      });
      setShowTransactionForm(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasEditedAccount) return;

    try {
      dispatch(
        actions.updateAccount({
          account: newUsername,
        })
      );
      setHasEditedAccount(true);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Stored Ethereum address:", ethereumAddress);
    await updateAccount(client, document.documentId, {
      account: ethereumAddress,
    });

    const importedTransactions = await importTransactions(client, document.documentId, { addresses: [ethereumAddress] });
    console.log("importedTransactions", importedTransactions);

    setShowImportModal(false);
    setEthereumAddress("");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Account Info */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          {account?.icon && (
            <img
              src={account.icon}
              alt="Account icon"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {account?.username && (
              <span style={{ fontWeight: "500" }}>{account.username}</span>
            )}
            <form
              onSubmit={handleUpdateAccount}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={hasEditedAccount}
                placeholder="Enter username"
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              {!hasEditedAccount && (
                <button
                  type="submit"
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              )}
            </form>
          </div>
          <span
            style={{
              backgroundColor: "#f3f4f6",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {account?.type || "CONTRIBUTOR"}
          </span>
        </div>
      </div>

      {/* Transaction Management Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Transaction Management</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button size="small" onClick={() => setShowImportModal(true)}>
            Import Transactions
          </Button>
          <Button size="small" onClick={() => setShowTransactionForm(true)}>
            New Txn
          </Button>
        </div>
      </div>

      {/* Import Transactions Modal */}
      {showImportModal && (
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
              <h2>Import Transactions</h2>
            </div>

            <form onSubmit={handleImportSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Ethereum Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Ethereum address"
                  value={ethereumAddress}
                  onChange={(e) => setEthereumAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setEthereumAddress("");
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f3f4f6",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {showTransactionForm && (
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
              <h2>New Transaction</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Counterparty
                  </label>
                  <input
                    type="text"
                    value={newTransaction.counterParty}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        counterParty: e.target.value,
                      })
                    }
                    placeholder="Enter counterparty address"
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
                    Amount
                  </label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
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
                    Transaction Hash
                  </label>
                  <input
                    type="text"
                    value={newTransaction.details.txHash}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        details: {
                          ...newTransaction.details,
                          txHash: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter transaction hash"
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
                    Token
                  </label>
                  <input
                    type="text"
                    value={newTransaction.details.token}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        details: {
                          ...newTransaction.details,
                          token: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter token"
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
                    Block Number
                  </label>
                  <input
                    type="number"
                    value={newTransaction.details.blockNumber}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        details: {
                          ...newTransaction.details,
                          blockNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter block number"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowTransactionForm(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f3f4f6",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>
                Txn Hash
              </th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>Block</th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>
                Counterparty
              </th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>Token</th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}>
                Budget Path
              </th>
              <th style={{ textAlign: "left", padding: "12px 8px" }}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any, index: any) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 8px", color: "#0066cc" }}>
                  {tx.details.txHash.substring(0, 10)}...
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {tx.details.blockNumber}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {new Date(tx.datetime).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {tx.counterParty?.substring(0, 5)}...
                  {tx.counterParty?.substring(tx.counterParty.length - 5)}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      color:
                        tx.counterParty.toLowerCase() === account?.username.toLowerCase()
                          ? "#22c55e"
                          : "#ef4444",
                      fontWeight: "500",
                    }}
                  >
                    {tx.counterParty.toLowerCase() === account?.username.toLowerCase() ? "In" : "Out"}
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {Math.abs(parseFloat(tx.amount.toString())).toFixed(2)}
                </td>
                <td style={{ padding: "12px 8px" }}>{tx.details.token}</td>
                <td style={{ padding: "12px 8px" }}>
                  {tx.budget || "SKY/Ecosystem-Actor/Powerhouse"}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <button
                    onClick={() => {
                      /* TODO: Delete transaction */
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4444",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TODO: Add modal for new transaction form */}
    </div>
  );
}
