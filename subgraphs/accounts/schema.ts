import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for Accounts (powerhouse/accounts)
  """
  type AccountsState {
    accounts: [AccountEntry!]!
  }

  type AccountEntry {
    id: OID!
    name: OLabel
    accountTransactionsId: PHID
    chain: String
    account: EthereumAddress
    budgetPath: String
    type: AccountType
    owners: [PHID]
  }

  enum AccountType {
    Protocol
    Auditor
    Operational
    Payment
    Processor
  }

  """
  Queries: Accounts
  """
  type AccountsQueries {
    getDocument(driveId: String, docId: PHID): Accounts
    getDocuments: [Accounts!]
  }

  type Query {
    Accounts: AccountsQueries
  }

  """
  Mutations: Accounts
  """
  type Mutation {
    Accounts_createDocument(driveId: String, name: String): String

    Accounts_createAccount(
      driveId: String
      docId: PHID
      input: Accounts_CreateAccountInput
    ): Int
    Accounts_updateAccount(
      driveId: String
      docId: PHID
      input: Accounts_UpdateAccountInput
    ): Int
    Accounts_deleteAccount(
      driveId: String
      docId: PHID
      input: Accounts_DeleteAccountInput
    ): Int
  }

  """
  Module: Accounts
  """
  input Accounts_CreateAccountInput {
    id: OID!
    name: OLabel
    accountTransactionsId: PHID
    chain: String
    account: EthereumAddress
    budgetPath: String
    type: AccountType
    owners: [PHID]
  }


  input Accounts_UpdateAccountInput {
    id: OID!
    name: OLabel
    accountTransactionsId: PHID
    chain: String
    account: EthereumAddress
    budgetPath: String
    type: AccountType
    owners: [PHID]
  }

  input Accounts_DeleteAccountInput {
    id: ID!
  }
`;
