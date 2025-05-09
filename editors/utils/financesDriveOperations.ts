import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { gql } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://switchboard.powerhouse.xyz/d/finances',
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

// Create the Apollo Client instance for finances
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

const GET_TRANSACTION_DOCUMENT = gql`
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
          }
        }
      }
    }
  }
`;

export async function getTransactionDocument(documentId: string) {
  try {
    const { data } = await client.query({
      query: GET_TRANSACTION_DOCUMENT,
      variables: {
        documentId,
      },
    });
    return data.document;
  } catch (error) {
    console.error('Error fetching transaction document:', error);
    throw error;
  }
}
