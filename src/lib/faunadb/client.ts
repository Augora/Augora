import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: "https://graphql.fauna.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.FAUNADB_TOKEN || "fnADtFRXPrACB6WCFPNkcNwEOSCfXW574OOspy5t"}`,
  },
  connectToDevTools: process.env.NEXT_PUBLIC_ENV !== "production",
  cache: new InMemoryCache(),
})

export default client
