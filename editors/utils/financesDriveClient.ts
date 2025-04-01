import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4001/d/finances_accs_txs',
  cache: new InMemoryCache(),
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
