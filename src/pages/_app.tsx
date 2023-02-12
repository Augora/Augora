import React, { useState, useEffect } from "react"
import { withRouter } from "next/router"
import Head from "next/head"
import { AppProps } from "next/app"
import sortBy from "lodash/sortBy"

import Layout from "components/layout"
import { hydrateStoreWithInitialLists } from "stores/deputesStore"

// Styles
import "../styles/app.scss"

interface IApp extends AppProps {
  pageProps: {
    title?: string
    deputes?: Deputy.DeputiesList
    groupes?: Group.GroupsList
    transparentHeader?: boolean
  }
}

export default withRouter(function MyApp({ Component, pageProps, router }: IApp) {
  if (pageProps.deputes) {
    const orderedDeputes = pageProps.deputes
    const orderedGroupes = sortBy(pageProps.groupes, "Ordre")
    hydrateStoreWithInitialLists(orderedDeputes, orderedGroupes)
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Layout location={router} title={pageProps.title} transparentHeader={pageProps.transparentHeader}>
        <Component {...(pageProps as any)} />
      </Layout>
    </>
  )
})
