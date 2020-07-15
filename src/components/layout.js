/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { colors } from "utils/variables"

import Header from "./header"
import Footer from "./footer"
import "./layout.css"
import "../styles/app.scss"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <style>{`:root {\n${allColors.join("")}}`}</style>
	<meta property="og:url" content="https://augora.fr" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Site web Augora" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
        <meta property="og:image:alt" content="Icône de l'association Augora" />
        <meta property="twitter:url" content="https://augora.fr" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Site web Augora" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="/icons/icon-512x512.png" />
      </Helmet>
      <Header siteTitle={"Augora"} />
      <section className="layout" style={{ padding: "120px 30px 100px" }}>
        <main>{children}</main>
      </section>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
