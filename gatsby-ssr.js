import React from "react"
import { Helmet } from "react-helmet"
import DeputiesListProvider from "./src/context/deputies-filters/deputiesFiltersContext"

export const onRenderBody = (
  { setHeadComponents, setHtmlAttributes, setBodyAttributes },
  pluginOptions
) => {
  const helmet = Helmet.renderStatic()
  setHtmlAttributes(helmet.htmlAttributes.toComponent())
  setBodyAttributes(helmet.bodyAttributes.toComponent())
  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent(),
    helmet.noscript.toComponent(),
    helmet.script.toComponent(),
    helmet.style.toComponent(),
  ])
}

export const wrapRootElement = ({ element }) => {
  return <DeputiesListProvider>{element}</DeputiesListProvider>
}
