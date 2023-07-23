import React, { useRef } from "react"
import { useScroll, useTransform, motion, useSpring } from "framer-motion"
import Image, { StaticImageData } from "next/image"

const MotionNextImg = motion(Image)

function Parallax({ img, intro = false, gradient = false }: { img: StaticImageData; intro?: boolean; gradient?: boolean }) {
  const ref = useRef<HTMLImageElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const yRange = useTransform(scrollYProgress, [!intro ? 0 : 0.5, 1], !intro ? [100, -100] : [0, -200]) // intro uses 0.5-1 range instead of 0-1 because `scrollYProgress` starts at 0.5 on the top of the page
  const y = useSpring(yRange, { damping: 90 })

  return (
    <div className="background background--parallax" ref={ref}>
      <MotionNextImg
        className={`background__img ${gradient ? "background__img--transparent" : ""}`}
        style={{ y, scale: 0.8 }}
        src={img}
        alt="Photographie"
        placeholder="blur"
      />
    </div>
  )
}

export default Parallax
