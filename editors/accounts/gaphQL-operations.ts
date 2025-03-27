import { gql } from '@apollo/client';
import { PHID } from '../../scripts/clients/atlas-exploratory.js';

// GraphQL Operations
export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($driveId: String, $name: String!) {
    Accounts_createDocument(driveId: $driveId, name: $name)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($driveId: String, $docId: PHID!, $input: Accounts_CreateAccountInput!) {
    Accounts_createAccount(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($driveId: String, $docId: PHID!, $input: Accounts_UpdateAccountInput!) {
    Accounts_updateAccount(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($driveId: String, $docId: PHID!, $input: Accounts_DeleteAccountInput!) {
    Accounts_deleteAccount(driveId: $driveId, docId: $docId, input: $input)
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
  return data.Accounts_createDocument;
};

export const createAccount = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
    name?: string;
    accountTransactionsId?: string;
    chain?: string;
    account?: string;
    budgetPath?: string;
    type?: 'Protocol' | 'Auditor' | 'Operational' | 'Payment' | 'Processor';
    owners?: string[];
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: CREATE_ACCOUNT,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.Accounts_createAccount;
};

export const updateAccount = async (
  client: any,
  docId: PHID,
  input: {
    id: string;
    name?: string;
    accountTransactionsId?: string;
    chain?: string;
    account?: string;
    budgetPath?: string;
    type?: 'Protocol' | 'Auditor' | 'Operational' | 'Payment' | 'Processor';
    owners?: string[];
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
  return data.Accounts_updateAccount;
};

export const deleteAccount = async (
  client: any,
  docId: string,
  input: {
    id: string;
  },
  driveId?: string
): Promise<number> => {
  const { data } = await client.mutate({
    mutation: DELETE_ACCOUNT,
    variables: {
      driveId,
      docId,
      input,
    },
  });
  return data.Accounts_deleteAccount;
};
