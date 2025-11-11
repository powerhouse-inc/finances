import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: FinanceSnapshot Document
  """
  type FinanceSnapshotQueries {
    getDocument(docId: PHID!, driveId: PHID): FinanceSnapshot
    getDocuments(driveId: String!): [FinanceSnapshot!]
  }

  type Query {
    FinanceSnapshot: FinanceSnapshotQueries
  }

  """
  Mutations: FinanceSnapshot
  """
  type Mutation {
    FinanceSnapshot_createDocument(name: String!, driveId: String): String

    FinanceSnapshot_createSnapshot(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_CreateSnapshotInput
    ): Int
    FinanceSnapshot_addWallet(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_AddWalletInput
    ): Int
    FinanceSnapshot_removeWallet(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_RemoveWalletInput
    ): Int
    FinanceSnapshot_updatePeriod(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_UpdatePeriodInput
    ): Int
    FinanceSnapshot_refreshSnapshotData(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_RefreshSnapshotDataInput
    ): Int
    FinanceSnapshot_addTransaction(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_AddTransactionInput
    ): Int
    FinanceSnapshot_updateWalletBalance(
      driveId: String
      docId: PHID
      input: FinanceSnapshot_UpdateWalletBalanceInput
    ): Int
  }

  """
  Module: Snapshot
  """
  input FinanceSnapshot_CreateSnapshotInput {
    id: OID!
    name: String!
    period: String!
    periodStart: DateTime!
    periodEnd: DateTime!
    owner: String!
    created: DateTime!
  }
  input FinanceSnapshot_AddWalletInput {
    id: OID!
    address: EthereumAddress!
    accountType: AccountTypeInput!
    label: String!
    accountTransactionsRef: PHID
  }

  enum AccountTypeInput {
    Protocol
    Auditor
    Operational
    PaymentProcessor
  }
  input FinanceSnapshot_RemoveWalletInput {
    walletId: OID!
  }
  input FinanceSnapshot_UpdatePeriodInput {
    periodStart: DateTime!
    periodEnd: DateTime!
    period: String!
  }
  input FinanceSnapshot_RefreshSnapshotDataInput {
    recalculateBalances: Boolean
    clearExistingData: Boolean
  }

  """
  Module: Transactions
  """
  input FinanceSnapshot_AddTransactionInput {
    id: ID!
    block: Int
    timestamp: DateTime!
    txHash: String!
    token: Currency!
    counterParty: EthereumAddress!
    amount: Amount_Currency!
    txLabel: String
    counterPartyName: String
    flowType: TransactionFlowTypeInput!
    fromWalletType: AccountTypeInput
    toWalletType: AccountTypeInput
  }

  enum TransactionFlowTypeInput {
    EXTERNAL_INFLOW
    EXTERNAL_OUTFLOW
    INTERNAL_TRANSFER
  }

  """
  Module: Balances
  """
  input FinanceSnapshot_UpdateWalletBalanceInput {
    id: OID!
    walletAddress: EthereumAddress!
    accountType: AccountTypeInput!
    token: Currency!
    startingBalance: Amount_Currency!
    endingBalance: Amount_Currency!
    externalInflow: Amount_Currency!
    externalOutflow: Amount_Currency!
    internalInflow: Amount_Currency!
    internalOutflow: Amount_Currency!
    netExternalChange: Amount_Currency!
  }
`;
