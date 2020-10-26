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
      </Helmet>
      <Header siteTitle={"Augora"} location={location} />
      <main className="layout">{children}</main>
      <Footer />
    </>
  )
}

export default Layout
