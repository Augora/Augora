import React, { useEffect, useState } from "react"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import dynamic from "next/dynamic"
import { slugify } from "src/utils/utils"
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
  const [Open, setOpen] = useState(props.opened ? true : false)

  useEffect(() => {
    setOpen(props.opened)
  }, [props.opened])

  return (
    <div
      id={slugify(props.title)}
      style={{ scrollMarginTop: 114 }}
      className={`faq__question ${Open ? "faq__question--opened" : ""}`}
    >
      <div
        className="faq__title-container"
        onClick={() => setOpen(!Open)}
        role="button"
        tabIndex={0}
        onKeyDown={() => setOpen(!Open)}
      >
        <GradientBanner />
        <h2>{props.title}</h2>
        <div className="arrow__icon icon-wrapper">
          <IconChevron />
        </div>
      </div>
      <div className="faq__description">{props.children}</div>
    </div>
  )
}
