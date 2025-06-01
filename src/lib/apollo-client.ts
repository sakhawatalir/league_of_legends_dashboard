import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from '@apollo/client';

const API_KEY = process.env.NEXT_PUBLIC_GRIDGG_API_KEY;

const centralDataLink = createHttpLink({
  uri: 'https://api.grid.gg/central-data/graphql',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY || '62Kk9rIyA5YTy5tzyBHiUJdaOFTVInvbd7WhZOA4',
  },
});

const seriesStateLink = createHttpLink({
  uri: 'https://api.grid.gg/live-data-feed/series-state/graphql',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY || '62Kk9rIyA5YTy5tzyBHiUJdaOFTVInvbd7WhZOA4',
  },
});

// Choose the link based on the operation context
const splitLink = ApolloLink.split(
  operation => operation.getContext().endpoint === 'live',
  seriesStateLink, // if the condition is true
  centralDataLink  // if the condition is false
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tournaments: {
            keyArgs: ['filter'],
            merge(existing, incoming) {
              if (!incoming) return existing;
              if (!existing) return incoming;

              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])]
              };
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
