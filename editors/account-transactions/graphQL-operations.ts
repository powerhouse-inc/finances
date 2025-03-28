import { gql } from '@apollo/client';
import { PHID } from '../../scripts/clients/atlas-exploratory.js';

// GraphQL Operations
export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($driveId: String, $name: String!) {
    AccountTransactions_createDocument(driveId: $driveId, name: $name)
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($driveId: String, $docId: PHID!, $input: AccountTransactions_CreateTransactionInput!) {
    AccountTransactions_createTransaction(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($driveId: String, $docId: PHID!, $input: AccountTransactions_UpdateTransactionInput!) {
    AccountTransactions_updateTransaction(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($driveId: String, $docId: PHID!, $input: AccountTransactions_DeleteTransactionInput!) {
    AccountTransactions_deleteTransaction(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const UPDATE_TRANSACTION_BUDGET = gql`
  mutation UpdateTransactionBudget($driveId: String, $docId: PHID!, $input: AccountTransactions_UpdateTransactionBudgetInput!) {
    AccountTransactions_updateTransactionBudget(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($driveId: String, $docId: PHID!, $input: AccountTransactions_UpdateAccountInput!) {
    AccountTransactions_updateAccount(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const IMPORT_TRANSACTIONS = gql`
  mutation ImportTransactions($driveId: String, $docId: PHID!, $input: AccountTransactions_ImportTransactionsInput!) {
    AccountTransactions_importTransactions(driveId: $driveId, docId: $docId, input: $input)
  }
`;

// Helper Functions
export const createDocument = async (
  client: any,
  name: string,
  driveId?: string
): Promise<string> => {
  const { data } = await client.mutate({
    mutation: CREATE_DOCUMENT,
    variables: {
      driveId,
      name,
    },
  });
  return data.AccountTransactions_createDocument;
};

export const createTransaction = async (
  client: any,
  docId: PHID,
  input: {
    counterParty: string;
    amount: number;
    datetime: string;
    details: {
      txHash: string;
      token: string;
      blockNumber: number;
    };
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: CREATE_TRANSACTION,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_createTransaction;
};

export const updateTransaction = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
    accountId?: string;
    amount?: number;
    timestamp?: number;
    type?: string;
    description?: string;
    metadata?: Record<string, any>;
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: UPDATE_TRANSACTION,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_updateTransaction;
};

export const deleteTransaction = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: DELETE_TRANSACTION,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_deleteTransaction;
};

export const updateTransactionBudget = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
    budgetPath?: string;
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: UPDATE_TRANSACTION_BUDGET,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_updateTransactionBudget;
};

export const updateAccount = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
    name?: string;
    type?: string;
    metadata?: Record<string, any>;
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: UPDATE_ACCOUNT,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_updateAccount;
};

export const importTransactions = async (
  client: any,
  docId: PHID,
  input: {
    addresses: string[];
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: IMPORT_TRANSACTIONS,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.AccountTransactions_importTransactions;
};
