import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { gql } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'https://switchboard.powerhouse.xyz/graphql',
});

// Create an auth link that adds any necessary headers
const authLink = setContext((_, { headers }) => {
    // You can add any authentication headers here if needed
    return {
        headers: {
            ...headers,
            // Add any custom headers here
        },
    };
});

// Create the Apollo Client instance
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
        },
    },
});

// Define the mutation
const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($name: String!, $driveId: String) {
    AccountTransactions_createDocument(name: $name, driveId: $driveId)
  }
`;

// Function to create a new document
export const createTxsDocument = async (name: string, driveId?: string): Promise<string> => {
    try {
        const { data } = await client.mutate({
            mutation: CREATE_DOCUMENT_MUTATION,
            variables: {
                name,
                driveId,
            },
        });

        return data.AccountTransactions_createDocument;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};


// Define the update account mutation
const UPDATE_ACCOUNT_MUTATION = gql`
  mutation UpdateAccount($docId: PHID!, $driveId: String, $input: AccountTransactions_UpdateAccountInput!) {
    AccountTransactions_updateAccount(docId: $docId, driveId: $driveId, input: $input)
  }
`;

// Function to update an account in a document
export const updateTxsAccount = async (
    docId: string,
    input: any,
    driveId?: string
): Promise<number> => {
    try {
        const { data } = await client.mutate({
            mutation: UPDATE_ACCOUNT_MUTATION,
            variables: {
                docId: docId,
                driveId,
                input,
            },
        });

        return data.AccountTransactions_updateAccount;
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
};


export const IMPORT_TRANSACTIONS = gql`
  mutation ImportTransactions($driveId: String, $docId: PHID!, $input: AccountTransactions_ImportTransactionsInput!) {
    AccountTransactions_importTransactions(driveId: $driveId, docId: $docId, input: $input)
  }
`;

export const importTransactions = async (
    docId: string,
    input: {
        addresses: string[];
    },
    driveId: string
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