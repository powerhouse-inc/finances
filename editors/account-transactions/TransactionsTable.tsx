interface Transaction {
  id: string;
  [key: string]: any;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  account: Record<string, any>;
  handleDeleteTransaction: (id: string) => void;
}

export default function TransactionsTable({
  transactions,
  account,
  handleDeleteTransaction,
}: TransactionsTableProps) {
  return (
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
            <th style={{ textAlign: "left", padding: "12px 8px" }}>Txn Hash</th>
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
                <a
                  href={`https://etherscan.io/tx/${tx.details.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.details.txHash.substring(0, 10)}...
                </a>
              </td>
              <td style={{ padding: "12px 8px" }}>{tx.details.blockNumber}</td>
              <td style={{ padding: "12px 8px" }}>
                {new Date(tx.datetime)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "-")
                  .toUpperCase()}
              </td>
              <td style={{ padding: "12px 8px" }}>
                {tx.counterParty?.substring(0, 5)}...
                {tx.counterParty?.substring(tx.counterParty.length - 5)}
              </td>
              <td style={{ padding: "12px 8px" }}>
                <span
                  style={{
                    color:
                      tx.counterParty.toLowerCase() ===
                      account?.username.toLowerCase()
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  {tx.counterParty.toLowerCase() ===
                  account?.username.toLowerCase()
                    ? "In"
                    : "Out"}
                </span>
              </td>
              <td style={{ padding: "12px 8px" }}>
                {Math.abs(parseFloat(tx.amount.toString()))
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </td>
              <td style={{ padding: "12px 8px" }}>{tx.details.token}</td>
              <td style={{ padding: "12px 8px" }}>{tx.budget || ""}</td>
              <td style={{ padding: "12px 8px" }}>
                <button
                  onClick={() => handleDeleteTransaction(tx.id)}
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
  );
}
