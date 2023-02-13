import React, { useEffect, useState, useRef } from "react"

function Panel({ className, orientation, shared = false, pageRef, children }) {
  const [isVisible, setIsvisible] = useState(false)

  const containerRef = useRef(null)

  const callbackFunction = (entries) => {
    const [entry] = entries
    if (entry.isIntersecting) setIsvisible(true)
  }

  useEffect(() => {
    const options = {
      root: pageRef ? pageRef.current : null,
      rootMargin: "0px",
      threshold: 0.6,
      trackVisibility: true,
      delay: 100,
    }

    const observer = new IntersectionObserver(callbackFunction, options)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [pageRef])

  return (
    <div
      className={`${className} panel panel--${orientation} ${shared ? "panel--shared" : ""} ${isVisible ? "visible" : "hidden"}`}
      ref={containerRef}
    >
      {children}
    </div>
  )
}

export default Panel
