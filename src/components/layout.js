/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"
import { colors } from "utils/variables"

import Header from "./header"
import Footer from "./footer"
import "../styles/app.scss"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

// Dynamic header current page
// TODO : Get current route to give state to Header ?

const Layout = ({ children, location }) => {
  return (
    <>
      <Helmet>
        <style>{`:root {\n${allColors.join("")}}`}</style>
        <meta name="og:url" content="https://augora.fr" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content="Site web Augora" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="/icons/icon-512x512.png" />
        <meta name="og:image:url" content="/icons/icon-512x512.png" />
        <meta name="og:image:secure_url" content="/icons/icon-512x512.png" />
        <meta name="og:image:secure" content="/icons/icon-512x512.png" />
        <meta name="og:image:alt" content="Icône de l'association Augora" />
        <meta name="twitter:url" content="https://augora.fr" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Site web Augora" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="/icons/icon-512x512.png" />
      </Helmet>
      <Header siteTitle={"Augora"} location={location} />
      <main className="layout">{children}</main>
      <Footer />
    </>
  )
}

export default Layout
