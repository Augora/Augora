import React, { useState } from "react"

// Graphics
import GradientBanner from "components/graphics/GradientBanner"

function Question(props) {
  const [Open, setOpen] = useState(false)
  return (
    <div
      className={`faq__question ${Open ? "faq__question--opened" : ""}`}
      onClick={() => setOpen(!Open)}
    >
      <div className="faq__title-container">
        <GradientBanner />
        <h2>{props.title}</h2>
      </div>
      <p className="faq__description">{props.description}</p>
    </div>
  )
}

export default Question
