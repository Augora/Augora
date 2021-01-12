import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from "@apollo/client"
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
  resultCaching: true,
})

const link = from([
  new RetryLink({
    attempts: (count, operation, error) => {
      return !!error && count < 3
    },
  }),
  new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      if (data && data.errors && data.errors.length > 0) {
        throw new Error(data.errors.map((e) => e.message).join("\n"))
      }
      return data
    })
  }),
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
