import React from "react"
import Head from "next/head"
import { colors } from "utils/variables"

import Header from "./header"
import Footer from "./footer"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

// TODO : Get current route to give state to Header ?

const Layout = ({ children, location }) => {
  return (
    <>
      <Head>
        <style>{`:root {\n${allColors.join("")}}`}</style>
      </Head>
      <Header siteTitle={"Augora"} location={location} />
      <main className="layout">{children}</main>
      <Footer />
    </>
  )
}

export default Layout
