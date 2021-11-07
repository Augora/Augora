import React, { useState, useEffect } from "react"
import { withRouter } from "next/router"
import Head from "next/head"
import { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import sortBy from "lodash/sortBy"

import Layout from "components/layout"
import Accropolis from "components/accropolis/Accropolis"
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
        <link
          rel="defer"
          href="https://fonts.googleapis.com/css?family=Open+Sans:100,200,300,400,500,600,700,800,900%7CRoboto+Slab:100,200,300,400,500,600,700,800,900"
          media="all"
        />
      </Head>
      <Layout location={router} title={pageProps.title}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
})
