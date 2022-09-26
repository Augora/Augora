import React from "react"

function Panel({ className, orientation, shared = false, children }) {
  return <div className={`${className} panel panel--${orientation} ${shared ? "panel--shared" : ""}`}>{children}</div>
}

export default Panel
