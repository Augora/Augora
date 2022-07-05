import React from "react"

export default function Popup({ className, children, show, setShow }) {
  if (show) {
    return (
      <div className={`popup ${className}`}>
        <div className="popup__close" onClick={() => setShow(false)}>
          <span></span>
          <span></span>
        </div>
        <div className="popup__wrapper">{children}</div>
      </div>
    )
  } else {
    return null
  }
}
