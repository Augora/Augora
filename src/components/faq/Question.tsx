import React, { useEffect, useState } from "react"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import dynamic from "next/dynamic"
import { slugify } from "src/utils/utils"
import { AnimatePresence, motion } from "framer-motion"
const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
  ssr: false,
})

interface IQuestion {
  title: string
  /** Si la question doit etre ouverte au rendering, default false */
  opened?: boolean
  children?: React.ReactNode
}

export default function Question(props: IQuestion) {
  const [open, setOpen] = useState(props.opened ? true : false)

  useEffect(() => {
    setOpen(props.opened)
  }, [props.opened])

  return (
    <div
      id={slugify(props.title)}
      style={{ scrollMarginTop: 114 }}
      className={`faq__question ${open ? "faq__question--opened" : ""}`}
    >
      <div
        className="faq__title-container"
        onClick={() => setOpen(!open)}
        onKeyDown={() => setOpen(!open)}
        role="button"
        tabIndex={0}
      >
        <GradientBanner />
        <h2>{props.title}</h2>
        <div className="arrow__icon icon-wrapper">
          <IconChevron />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq__description"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 30 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
          >
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
