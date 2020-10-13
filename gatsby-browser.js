import React from "react"
// import ReactDOM from "react-dom"
import DeputiesListProvider from "./src/context/deputies-filters/deputiesFiltersContext"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
}

export const wrapRootElement = ({ element }) => {
  return <DeputiesListProvider>{element}</DeputiesListProvider>
}
