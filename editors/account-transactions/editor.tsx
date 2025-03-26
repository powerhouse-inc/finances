import { type EditorProps, hashKey } from "document-model";
import {
  type AccountTransactionsDocument,
  actions,
} from "../../document-models/account-transactions/index.js";
import { useState, useEffect } from "react";
import { formatTokenAmount, getTokenSymbol } from "./utils.js";

export type IProps = EditorProps<AccountTransactionsDocument>;

export default function Editor(props: IProps) {
  const { document, dispatch } = props;
  const { state } = document;
  const transactions = state.global?.transactions || [];
  const account = state.global?.account;

  const [hasEditedAccount, setHasEditedAccount] = useState(false);
  const [newUsername, setNewUsername] = useState(account?.username || "");

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
      await dispatch(
        actions.createTransaction({
          counterParty: newTransaction.counterParty,
          amount: parseFloat(newTransaction.amount),
          datetime: new Date().toISOString(),
          details: {
            txHash: newTransaction.details.txHash,
            token: newTransaction.details.token,
            blockNumber: parseInt(newTransaction.details.blockNumber) || null,
          },
        })
      );

      setNewTransaction({
        counterParty: "",
        amount: "",
        details: {
          txHash: "",
          token: "",
          blockNumber: "",
        },
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasEditedAccount) return;

    try {
      await dispatch(
        actions.updateAccount({
          account: newUsername,
        })
      );
      setHasEditedAccount(true);
    } catch (error) {
      console.error("Error updating account:", error);
    }
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
        <button
          onClick={() => setShowTransactionForm(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          New Txn
        </button>
      </div>

      {showTransactionForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ display: "grid", gap: "10px", maxWidth: "500px" }}>
            <input
              type="text"
              value={newTransaction.counterParty}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  counterParty: e.target.value,
                })
              }
              placeholder="Counterparty"
            />
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
              placeholder="Amount"
            />
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
              placeholder="Transaction Hash"
            />
            <input
              type="text"
              value={newTransaction.details.token}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  details: { ...newTransaction.details, token: e.target.value },
                })
              }
              placeholder="Token"
            />
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
              placeholder="Block Number"
            />
            <button type="submit">Submit Transaction</button>
            <button type="button" onClick={() => setShowTransactionForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <th style={{ textAlign: "left", padding: "12px 8px" }}>Txn Hash</th>
            <th style={{ textAlign: "left", padding: "12px 8px" }}>Block</th>
            <th style={{ textAlign: "left", padding: "12px 8px" }}>Date</th>
            <th style={{ textAlign: "left", padding: "12px 8px" }}>
              Counterparty Address
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
          {transactions.map((tx) => (
            <tr key={tx.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 8px", color: "#0066cc" }}>
                {tx.details.txHash.substring(0, 10)}...
              </td>
              <td style={{ padding: "12px 8px" }}>{tx.details.blockNumber}</td>
              <td style={{ padding: "12px 8px" }}>
                {new Date(tx.datetime).toLocaleDateString()}
              </td>
              <td style={{ padding: "12px 8px" }}>
                {tx.counterParty?.substring(0, 10)}...
              </td>
              <td style={{ padding: "12px 8px" }}>
                <span
                  style={{
                    color:
                      parseFloat(tx.amount.toString()) > 0
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  {parseFloat(tx.amount.toString()) > 0 ? "In" : "Out"}
                </span>
              </td>
              <td style={{ padding: "12px 8px" }}>
                {Math.abs(parseFloat(tx.amount.toString()))}
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

      {/* TODO: Add modal for new transaction form */}
    </div>
  );
}
