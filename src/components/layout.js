/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle={"Augora"} />
      <section
        className="layout"
        style={{
          padding: `120px 20px 0 20px`,
        }}
      >
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
