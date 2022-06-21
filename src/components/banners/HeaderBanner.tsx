import React, { useState } from "react"
import IconClose from "images/ui-kit/icon-close.svg"

export default function headerBanner(props: { children?: React.ReactNode }) {
  const [visible, setVisible] = useState(true)

  return (
    visible && (
      <div className="header__banner">
        <div className="banner__content">{props.children}</div>
        <button className="banner__close" title="Fermer" onClick={() => setVisible(false)}>
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </button>
      </div>
    )
  )
}
