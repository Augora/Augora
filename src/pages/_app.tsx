import React, { useState, useEffect } from "react"
import { withRouter } from "next/router"
import Head from "next/head"
import { AppProps } from "next/app"
import sortBy from "lodash/sortBy"

import Layout from "components/layout"
import LoadingScreen from "components/frames/LoadingScreen"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { hydrateStoreWithInitialLists } from "stores/deputesStore"

// Styles
import "../styles/app.scss"
import PageTransition from "src/components/animations/PageTransition"

export default withRouter(function MyApp({ Component, pageProps, router }: AppProps) {
  // const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   let timer
  //   const aniStart = async (url) => {
  //     console.log(`Loading: ${url} : loading = `, loading)
  //     timer = setTimeout(() => {
  //       if (!loading) {
  //         setLoading(true)
  //         const tl = gsap.timeline()
  //         tl.to("#loading-screen", {
  //           scaleX: 1,
  //           duration: 0.2,
  //           ease: "Expo.easeInOut",
  //           onComplete: () => {
  //             document.querySelector("#loading-screen").classList.add("loading")
  //           },
  //         })
  //       }
  //     }, 300)
  //   }
  //   const aniEnd = () => {
  //     console.log(`Loading completed : loading = `, loading)
  //     if (timer) {
  //       clearTimeout(timer)
  //     }
  //     const tl = gsap.timeline()
  //     if (loading) {
  //       tl.to("#loading-screen", {
  //         scaleX: 0,
  //         duration: 0.8,
  //         ease: "Expo.easeInOut",
  //         onComplete: () => {
  //           document.querySelector("#loading-screen").classList.remove("loading")
  //         },
  //       })
  //       setLoading(false)
  //     }

  //     tl.set("#loading-screen", { scaleX: 0 })
  //     clearTimeout(timer)
  //   }

  //   router.events.on("routeChangeStart", aniStart)
  //   router.events.on("routeChangeComplete", aniEnd)
  //   router.events.on("routeChangeError", aniEnd)

  //   return () => {
  //     router.events.off("routeChangeStart", aniStart)
  //     router.events.off("routeChangeComplete", aniEnd)
  //     router.events.off("routeChangeError", aniEnd)
  //   }
  // }, [router])

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
      {/* <PageTransition> */}
      <Layout location={router} title={pageProps.title}>
        <Component {...pageProps} />
      </Layout>
      {/* </PageTransition> */}
      {/* <LoadingScreen /> */}
      {/* <AnimatePresence exitBeforeEnter> */}
      {/* <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2000,
            // delay: 0.5,
            // ease: [0, 0.71, 0.2, 1.01]
          }}
        >
          {loading ? <LoadingScreen/> : null}
        </motion.div> */}
      {/* </AnimatePresence> */}
    </>
  )
})
