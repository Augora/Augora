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
      </Helmet>
      <Header siteTitle={"Augora"} />
      <section className="layout" style={{ padding: "120px 30px 100px" }}>
        <main>{children}</main>
      </section>
      <footer
        style={{
          height: 200,
          padding: `20px`,
          backgroundColor: `black`,
          color: `white`,
        }}
      >
        © {new Date().getFullYear()} Augora
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
