import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client"
import { RetryLink } from "@apollo/client/link/retry"

const cache = new InMemoryCache({
  typePolicies: {
    Depute: {
      fields: {
        Ordre: {
          read() {
            return Math.floor(Math.random() * 5000)
          },
        },
      },
    },
  },
})

const link = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://graphql.fauna.com/graphql",
    headers: {
      Authorization: `Bearer ${process.env.FAUNADB_TOKEN || "fnADtFRXPrACB6WCFPNkcNwEOSCfXW574OOspy5t"}`,
    },
  }),
])

const client = new ApolloClient({
  link,
  connectToDevTools: process.env.NEXT_PUBLIC_ENV !== "production",
  cache,
})

export default client
