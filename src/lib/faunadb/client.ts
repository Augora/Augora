import { ApolloClient, InMemoryCache } from "@apollo/client"

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

const client = new ApolloClient({
  uri: "https://graphql.fauna.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.FAUNADB_TOKEN || "fnADtFRXPrACB6WCFPNkcNwEOSCfXW574OOspy5t"}`,
  },
  connectToDevTools: process.env.NEXT_PUBLIC_ENV !== "production",
  cache,
})

export default client
