import React, { useState, useEffect } from "react"

export default function Popin({ isInitialState, children }) {
  const [visible, setVisible] = useState(!isInitialState)

  useEffect(() => {
    setVisible(!isInitialState)
  }, [isInitialState])

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
