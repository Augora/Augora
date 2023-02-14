import React from "react"
import { useInView } from "react-intersection-observer"

function Panel({ className, orientation, shared = false, children }) {
  // Uses https://www.npmjs.com/package/react-intersection-observer
  const { ref, inView, entry } = useInView({
    /* Optional options */
    triggerOnce: true,
    threshold: 0.6,
  })

  // Render
  return (
    <div
      className={`${className} panel panel--${orientation} ${shared ? "panel--shared" : ""} ${inView ? "visible" : "hidden"}`}
      ref={ref}
    >
      <div className="panel__shutter">{/* Silence is golden */}</div>
      {children}
    </div>
  )
}

export default Panel
