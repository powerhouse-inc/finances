import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  id: "powerhouse/finance-snapshot",
  name: "FinanceSnapshot",
  extension: ".phdm",
  description:
    "Document model for financial portfolio snapshots tracking balance changes and transaction flows between start and end periods across multiple team wallets",
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "type FinanceSnapshotState {\n  id: OID!\n  name: String!\n  period: String!\n  periodStart: DateTime!\n  periodEnd: DateTime!\n  owner: String!\n  created: DateTime!\n  accountsDocumentId: PHID\n\n  wallets: [SnapshotWallet!]!\n  transactions: [SnapshotTransaction!]!\n  balances: [WalletBalance!]!\n}\n\ntype SnapshotWallet {\n  id: OID!\n  address: EthereumAddress!\n  accountType: AccountType!\n  label: String!\n  accountTransactionsRef: PHID\n}\n\ntype SnapshotTransaction {\n  id: ID!\n  block: Int\n  timestamp: DateTime!\n  txHash: String!\n  token: Currency!\n  counterParty: EthereumAddress!\n  amount: Amount_Currency!\n  txLabel: String\n  counterPartyName: String\n  flowType: TransactionFlowType!\n  fromWalletType: AccountType\n  toWalletType: AccountType\n}\n\ntype WalletBalance {\n  id: OID!\n  walletAddress: EthereumAddress!\n  accountType: AccountType!\n  token: Currency!\n  startingBalance: Amount_Currency!\n  endingBalance: Amount_Currency!\n  externalInflow: Amount_Currency!\n  externalOutflow: Amount_Currency!\n  internalInflow: Amount_Currency!\n  internalOutflow: Amount_Currency!\n  netExternalChange: Amount_Currency!\n}\n\nenum AccountType {\n  Protocol\n  Auditor\n  Operational\n  PaymentProcessor\n}\n\nenum TransactionFlowType {\n  EXTERNAL_INFLOW\n  EXTERNAL_OUTFLOW\n  INTERNAL_TRANSFER\n}",
          initialValue:
            '"{\\n  \\"id\\": \\"\\",\\n  \\"name\\": \\"\\",\\n  \\"period\\": \\"\\",\\n  \\"periodStart\\": \\"\\",\\n  \\"periodEnd\\": \\"\\",\\n  \\"owner\\": \\"\\",\\n  \\"created\\": \\"\\",\\n  \\"accountsDocumentId\\": null,\\n  \\"wallets\\": [],\\n  \\"transactions\\": [],\\n  \\"balances\\": []\\n}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "snapshot-management",
          name: "snapshot",
          description: "Core snapshot management operations",
          operations: [
            {
              id: "create-snapshot",
              name: "CREATE_SNAPSHOT",
              description:
                "Create a new financial snapshot with basic information",
              schema:
                "input CreateSnapshotInput {\n  id: OID!\n  name: String!\n  period: String!\n  periodStart: DateTime!\n  periodEnd: DateTime!\n  owner: String!\n  created: DateTime!\n  accountsDocumentId: PHID\n}",
              template:
                "Create a new financial snapshot with basic information",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "add-wallet",
              name: "ADD_WALLET",
              description: "Add a wallet to the snapshot with account type",
              schema:
                "input AddWalletInput {\n  id: OID!\n  address: EthereumAddress!\n  accountType: AccountTypeInput!\n  label: String!\n  accountTransactionsRef: PHID\n}\n\nenum AccountTypeInput {\n  Protocol\n  Auditor\n  Operational\n  PaymentProcessor\n}",
              template: "Add a wallet to the snapshot with account type",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "remove-wallet",
              name: "REMOVE_WALLET",
              description: "Remove a wallet from the snapshot",
              schema: "input RemoveWalletInput {\n  walletId: OID!\n}",
              template: "Remove a wallet from the snapshot",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "update-period",
              name: "UPDATE_PERIOD",
              description: "Update the snapshot period dates",
              schema:
                "input UpdatePeriodInput {\n  periodStart: DateTime!\n  periodEnd: DateTime!\n  period: String!\n}",
              template: "Update the snapshot period dates",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "refresh-data",
              name: "REFRESH_SNAPSHOT_DATA",
              description:
                "Refresh snapshot data by pulling transactions from linked AccountTransactions documents",
              schema:
                "input RefreshSnapshotDataInput {\n  recalculateBalances: Boolean\n  clearExistingData: Boolean\n}",
              template:
                "Refresh snapshot data by pulling transactions from linked AccountTransactions documents",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "initialize-from-accounts",
              name: "INITIALIZE_FROM_ACCOUNTS",
              description:
                "Initialize snapshot from an Accounts document with validation",
              schema:
                "input InitializeFromAccountsInput {\n  accountsDocumentId: PHID!\n  accounts: [AccountInput!]!\n  tokens: [Currency!]!\n}\n\ninput AccountInput {\n  id: OID!\n  address: EthereumAddress!\n  name: String!\n  accountType: AccountTypeInput!\n  accountTransactionsId: PHID!\n}",
              template:
                "Initialize snapshot from an Accounts document with validation",
              reducer: "",
              errors: [
                {
                  id: "missing-transactions",
                  code: "MISSING_TRANSACTIONS",
                  name: "MissingTransactionsError",
                  description:
                    "Thrown when an account does not have a transactions file",
                  template: "",
                },
              ],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "transaction-management",
          name: "transactions",
          description: "Transaction data management for snapshots",
          operations: [
            {
              id: "add-transaction",
              name: "ADD_TRANSACTION",
              description: "Add a transaction to the snapshot",
              schema:
                "input AddTransactionInput {\n  id: ID!\n  block: Int\n  timestamp: DateTime!\n  txHash: String!\n  token: Currency!\n  counterParty: EthereumAddress!\n  amount: Amount_Currency!\n  txLabel: String\n  counterPartyName: String\n  flowType: TransactionFlowTypeInput!\n  fromWalletType: AccountTypeInput\n  toWalletType: AccountTypeInput\n}\n\nenum TransactionFlowTypeInput {\n  EXTERNAL_INFLOW\n  EXTERNAL_OUTFLOW\n  INTERNAL_TRANSFER\n}",
              template: "Add a transaction to the snapshot",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "balance-management",
          name: "balances",
          description: "Wallet balance tracking and calculations",
          operations: [
            {
              id: "update-wallet-balance",
              name: "UPDATE_WALLET_BALANCE",
              description:
                "Update balance information for a specific wallet and token",
              schema:
                "input UpdateWalletBalanceInput {\n  id: OID!\n  walletAddress: EthereumAddress!\n  accountType: AccountTypeInput!\n  token: Currency!\n  startingBalance: Amount_Currency!\n  endingBalance: Amount_Currency!\n  externalInflow: Amount_Currency!\n  externalOutflow: Amount_Currency!\n  internalInflow: Amount_Currency!\n  internalOutflow: Amount_Currency!\n  netExternalChange: Amount_Currency!\n}",
              template:
                "Update balance information for a specific wallet and token",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
