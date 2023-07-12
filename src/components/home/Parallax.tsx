import React, { useRef } from "react"
import { useScroll, useTransform, motion, useSpring } from "framer-motion"

function Parallax({ img, intro = false, gradient = false }: { img: string; intro?: boolean; gradient?: boolean }) {
  const ref = useRef<HTMLImageElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const yRange = useTransform(scrollYProgress, [0, 1], !intro ? [100, -350] : [400, -450]) // intro has double the range because `scrollYProgress` starts at 0.5 on the top of the page
  const y = useSpring(yRange, { damping: 90 })

  return (
    <div className="background background--parallax">
      <motion.img
        className={`background__img ${gradient ? "background__img--transparent" : ""}`}
        ref={ref}
        src={img}
        style={{ y, scale: 0.7 }}
      />
    </div>
  )
}

export default Parallax
