import React, { useState } from "react"

export default function Popin({ children }) {
  const [visible, setVisible] = useState(true)

  if (visible) {
    return (
      <div className="popin">
        <div className="popin__content">{children}</div>
        <button className="popin__close" onClick={() => setVisible(false)}>
          <span></span>
          <span></span>
        </button>
      </div>
    )
  } else {
    return null
  }
}
