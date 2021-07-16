import React, { useState } from "react"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import dynamic from "next/dynamic"
const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
  ssr: false,
})

interface IQuestion {
  title: string
  children?: React.ReactNode
}

function Question(props: IQuestion) {
  const [Open, setOpen] = useState(true)
  return (
    <div className={`faq__question ${Open ? "faq__question--opened" : ""}`}>
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

export default Question
