import React, { useEffect, useRef } from "react"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

function Parallax({ img, intro = false, gradient = false }) {
  const panel = useRef()
  const panelContainer = useRef()

  useEffect(() => {
    gsap.fromTo(
      panel.current,
      {
        yPercent: 0,
      },
      {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: panelContainer.current,
          scrub: 5,
          start: intro ? "top top" : "top bottom",
          end: () => {
            return intro ? "+=" + panelContainer.current.offsetHeight : "bottom top"
          },
        },
      }
    )
  }, [])

  return (
    <div className="background background--parallax" ref={panelContainer}>
      {/* {gradient && <div className="background__back" />} */}
      <img className={`background__img ${gradient ? "background__img--transparent" : ""}`} src={img} ref={panel} />
    </div>
  )
}

export default Parallax
