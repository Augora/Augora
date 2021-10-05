import React from "react"
import { withRouter } from "next/router"
import Head from "next/head"
import { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import sortBy from "lodash/sortBy"

import Layout from "components/layout"
import client from "lib/faunadb/client"
import { hydrateStoreWithInitialLists } from "stores/deputesStore"

// Styles
import "../styles/app.scss"

export default withRouter(function MyApp({ Component, pageProps, router }: AppProps) {
  if (pageProps.deputes) {
    const orderedDeputes = sortBy(pageProps.deputes.data.DeputesEnMandat.data, "Ordre")
    const orderedGroupes = sortBy(pageProps.deputes.data.GroupesParlementairesDetailsActifs.data, "Ordre")
    hydrateStoreWithInitialLists(orderedDeputes, orderedGroupes)
  }
  return (
    <ApolloProvider client={client}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href={`https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`} rel="stylesheet" />
      </Head>
      <Layout location={router} title={pageProps.title}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
})
