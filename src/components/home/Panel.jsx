import React, { useEffect, useLayoutEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
// import { gsap } from "gsap"

function Panel({ className, orientation, shared = false, children }) {
  // Uses https://www.npmjs.com/package/react-intersection-observer
  const { ref, inView, entry } = useInView({
    /* Optional options */
    triggerOnce: true,
    threshold: 0.6,
  })

  // let ctx
  // Gsap Context
  // useEffect(() => {
  //   if (entry) {
  //     ctx = gsap.context(() => {
  //       gsap.set(".panel__shutter", {
  //         scaleX: 0,
  //       })
  //     }, entry.target)
  //   }
  // }, [inView])

  // On view change (going in/out of viewport)
  // useEffect(() => {
  //   return () => {
  //     console.count("got out of home")
  //     if (ctx) ctx.revert()
  //   }
  // }, [])

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
