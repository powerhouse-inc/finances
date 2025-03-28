import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4001/account-transactions',
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
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
}); 