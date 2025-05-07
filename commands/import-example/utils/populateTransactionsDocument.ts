import { gql } from 'graphql-tag';
import fetch, { Response } from 'node-fetch';

const GRAPH_ENDPOINT = 'http://localhost:4001/d/finances_accs_txs';
const ACCOUNT_TRANSACTIONS_ENDPOINT = 'http://localhost:4001/account-transactions';
const ACCOUNTS_ENDPOINT = 'http://localhost:4001/accounts';
const FETCH_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds between retries

interface Account {
  id: string;
  name: string;
  accountTransactionsId: string;
  chain: string;
  account: string;
  budgetPath: string;
  type: string;
  owners: string[];
}

interface Transaction {
  counterParty: string;
  amount: number;
  datetime: string;
  details: {
    txHash: string;
    token: string;
    blockNumber: number;
  };
  budget: string | null;
}

interface AccountsResponse {
  data: {
    document: {
      id: string;
      name: string;
      state: {
        accounts: Account[];
      };
    };
  };
}

interface TransactionsResponse {
  data: {
    document: {
      state: {
        account: {
          id: string;
          username: string;
        };
        transactions: Transaction[];
      };
    };
  };
}

interface CreateDocumentResponse {
  data: {
    AccountTransactions_createDocument: string;
  };
}

interface ImportTransactionsResponse {
  data: {
    AccountTransactions_importTransactions: number;
  };
}

interface UpdateAccountResponse {
  data: {
    Accounts_updateAccount: number;
  };
}

interface UpdateAccountTransactionsResponse {
  data: {
    AccountTransactions_updateAccount: number;
  };
}

const ACCOUNTS_QUERY = gql`
  query Query($documentId: String!) {
    document(id: $documentId) {
      id
      name
      ... on Accounts {
        state {
          accounts {
            id
            name
            accountTransactionsId
            chain
            account
            budgetPath
            type
            owners
          }
        }
      }
    }
  }
`;

const TRANSACTIONS_QUERY = gql`
  query Document($documentId: String!) {
    document(id: $documentId) {
      ... on AccountTransactions {
        state {
          account {
            id
            username
          }
          transactions {
            counterParty
            amount
            datetime
            details {
              txHash
              token
              blockNumber
            }
            budget
          }
        }
      }
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = gql`
  mutation Mutation($driveId: String, $name: String) {
    AccountTransactions_createDocument(driveId: $driveId, name: $name)
  }
`;

const IMPORT_TRANSACTIONS_MUTATION = gql`
  mutation Mutation($driveId: String, $docId: PHID, $input: AccountTransactions_ImportTransactionsInput) {
    AccountTransactions_importTransactions(driveId: $driveId, docId: $docId, input: $input)
  }
`;

const UPDATE_ACCOUNT_MUTATION = gql`
  mutation Mutation($docId: PHID, $input: Accounts_UpdateAccountInput, $driveId: String) {
    Accounts_updateAccount(docId: $docId, input: $input, driveId: $driveId)
  }
`;

const UPDATE_ACCOUNT_TRANSACTIONS_MUTATION = gql`
  mutation AccountTransactions_updateAccount($driveId: String, $docId: PHID, $input: AccountTransactions_UpdateAccountInput) {
    AccountTransactions_updateAccount(driveId: $driveId, docId: $docId, input: $input)
  }
`;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, options: any, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response as Response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchGraphQLWithRetry<T>(
  query: any, 
  variables: any, 
  endpoint: string = GRAPH_ENDPOINT,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query.loc.source.body,
            variables,
          }),
        },
        FETCH_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt < retries) {
        console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
        await sleep(RETRY_DELAY);
      }
    }
  }
  
  throw lastError;
}

async function createTransactionsDocument(name: string): Promise<string> {
  const result = await fetchGraphQLWithRetry<CreateDocumentResponse>(
    CREATE_DOCUMENT_MUTATION,
    {
      driveId: null,
      name,
    },
    ACCOUNT_TRANSACTIONS_ENDPOINT
  );
  return result.data.AccountTransactions_createDocument;
}

async function importTransactions(docId: string, accountAddress: string): Promise<number> {
  const result = await fetchGraphQLWithRetry<ImportTransactionsResponse>(
    IMPORT_TRANSACTIONS_MUTATION,
    {
      driveId: null,
      docId,
      input: {
        addresses: [accountAddress],
      },
    },
    ACCOUNT_TRANSACTIONS_ENDPOINT
  );
  return result.data.AccountTransactions_importTransactions;
}

async function updateAccount(docId: string, accountId: string, accountTransactionsId: string): Promise<number> {
  const result = await fetchGraphQLWithRetry<UpdateAccountResponse>(
    UPDATE_ACCOUNT_MUTATION,
    {
      driveId: null,
      docId: docId,
      input: {
        id: accountId,
        accountTransactionsId,
      },
    },
    ACCOUNTS_ENDPOINT
  );
  return result.data.Accounts_updateAccount;
}

async function updateAccountTransactions(docId: string, accountAddress: string): Promise<number> {
  const result = await fetchGraphQLWithRetry<UpdateAccountTransactionsResponse>(
    UPDATE_ACCOUNT_TRANSACTIONS_MUTATION,
    {
      driveId: null,
      docId,
      input: {
        account: accountAddress,
      },
    },
    ACCOUNT_TRANSACTIONS_ENDPOINT
  );
  return result.data.AccountTransactions_updateAccount;
}

export async function populateTransactionsDocument(accountsDocumentId: string) {
  try {
    // Fetch accounts document
    const accountsResult = await fetchGraphQLWithRetry<AccountsResponse>(ACCOUNTS_QUERY, {
      documentId: accountsDocumentId,
    });

    if (!accountsResult.data?.document?.state?.accounts) {
      throw new Error('No accounts found in the document');
    }

    const accounts = accountsResult.data.document.state.accounts;
    const docId = accountsResult.data.document.id;
    
    // Process each account
    for (const account of accounts) {
      const { id, name, accountTransactionsId, account: accountAddress } = account;

      if (!accountTransactionsId) {
        console.log(`Account "${name}" (${accountAddress}) has no transactions document yet. Creating one...`);
        
        try {
          // Create new transactions document
          const newDocId = await createTransactionsDocument(name);
          console.log(`Created new transactions document with ID: ${newDocId}`);

          // Update account with new transactions document ID
          await updateAccount(docId, id, newDocId);

          // Update counterparty address in account transactions document
          await updateAccountTransactions(newDocId, accountAddress);
          
          // Import transactions for this account
          await importTransactions(newDocId, accountAddress);
          console.log(`Transactions imported for account "${name}"`);
          
          // Continue to next account
          continue;
        } catch (error) {
          console.error(`Error creating/importing transactions for account "${name}":`, error);
          if (error instanceof Error) {
            console.error('Error details:', error.message);
            if (error.cause) {
              console.error('Error cause:', error.cause);
            }
          }
          continue;
        }
      }

      // Only fetch existing transactions, don't import again
      const transactionsResult = await fetchGraphQLWithRetry<TransactionsResponse>(TRANSACTIONS_QUERY, {
        documentId: accountTransactionsId,
      });

      if (transactionsResult.data?.document?.state?.transactions) {
        const transactions = transactionsResult.data.document.state.transactions;
        console.log(`Found ${transactions.length} existing transactions for account "${name}"`);
      }
    }
  } catch (error) {
    console.error('Error processing accounts document:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
    }
    throw error;
  }
}
