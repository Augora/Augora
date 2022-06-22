import React, { useState } from "react"

export default function headerBanner(props: { children?: React.ReactNode }) {
  const [visible, setVisible] = useState(true)

  return (
    visible && (
      <div className="header__banner">
        <div className="banner__content">{props.children}</div>
        <button className="banner__close" title="Fermer" onClick={() => setVisible(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" height={20} width={20}>
            <circle cx="12" cy="12" r="12" fill="white" />
            <path
              d="M204.88,155l-29.61-29.68,68-68.08a23.13,23.13,0,0,0,0-32.6L225.89,7.26a23.13,23.13,0,0,0-32.6,0l-68,68-67.95-68a23.13,23.13,0,0,0-32.6,0L7.39,24.65a23.13,23.13,0,0,0,0,32.6l68,68.08-68,68.08a23.13,23.13,0,0,0,0,32.6L24.78,243.4a23.11,23.11,0,0,0,32.6,0l67.95-68L154.89,205l38.4,38.4a23.11,23.11,0,0,0,32.6,0L243.28,226a23.13,23.13,0,0,0,0-32.6Z"
              transform="translate(5.5, 5.5) scale(0.05)"
            />
          </svg>
        </button>
      </div>
    )
  )
}
