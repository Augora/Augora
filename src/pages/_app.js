import React from "react"
import { withRouter } from "next/router"
import Head from "next/head"

import DeputiesListProvider from "../context/deputies-filters/deputiesFiltersContext"
import { getDeputes } from "../lib/deputes/Wrapper"
import Layout from "components/layout"

// Styles
import "../styles/app.scss"

export default withRouter(function MyApp({ Component, pageProps, router }) {
  return (
    <DeputiesListProvider initialData={pageProps.deputes}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:100,200,300,400,500,600,700,800,900%7CRoboto+Slab:100,200,300,400,500,600,700,800,900"
          media="all"
        />
      </Head>
      <Layout location={router}>
        <Component {...pageProps} />
      </Layout>
    </DeputiesListProvider>
  )
})

export async function getStaticProps() {
  const deputes = await getDeputes()

  return {
    props: {
      deputes,
    },
  }
}
