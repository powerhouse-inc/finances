import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for AccountTransactions (powerhouse/account-transactions)
  """
  type AccountTransactionsState {
    account: AgentLink
    transactions: [TransactionEntry!]!
    budgets: [Budget!]!
  }

  type TransactionEntry {
    id: ID!
    counterParty: EthereumAddress
    amount: Amount_Tokens!
    datetime: DateTime!
    details: TransactionDetails!
    budget: OID
  }

  type TransactionDetails {
    txHash: String!
    token: Currency!
    blockNumber: Int
  }

  type Budget {
    id: OID!
    name: OLabel
  }

  type AgentLink {
    id: PHID!
    username: String
    type: AgentType
    icon: URL
  }

  enum AgentType {
    CONTRIBUTOR
    TEAM
    AI
  }

  """
  Mutations: AccountTransactions
  """
  type Mutation {
    AccountTransactions_createDocument(driveId: String, name: String): String

    AccountTransactions_createTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_CreateTransactionInput
    ): Int
    AccountTransactions_updateTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateTransactionInput
    ): Int
    AccountTransactions_deleteTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_DeleteTransactionInput
    ): Int
    AccountTransactions_updateTransactionBudget(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateTransactionBudgetInput
    ): Int
    AccountTransactions_updateAccount(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateAccountInput
    ): Int
    AccountTransactions_importTransactions(
      driveId: String
      docId: PHID
      input: AccountTransactions_ImportTransactionsInput
    ): Int
  }

  """
  Module: AccountTransactions
  """
  input AccountTransactions_CreateTransactionInput {
    counterParty: EthereumAddress
    amount: Amount_Money!
    datetime: DateTime!
    details: TransactionDetailsInput!
    budget: OID
  }

  input TransactionDetailsInput {
    txHash: String!
    token: Currency!
    blockNumber: Int
  }

  input AccountTransactions_UpdateTransactionInput {
    counterParty: EthereumAddress
    amount: Amount_Money
    datetime: DateTime
    details: TransactionDetailsInput
    budget: OID
  }

  input AccountTransactions_DeleteTransactionInput {
    id: ID!
  }
  input AccountTransactions_UpdateTransactionBudgetInput {
    txId: ID!
    budgetId: OID!
  }
  input AccountTransactions_UpdateAccountInput {
    account: String
  }
  input AccountTransactions_ImportTransactionsInput {
    addresses: [EthereumAddress]
  }
`;
