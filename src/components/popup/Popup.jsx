import React from "react"

export default function Popup({ className, children, showing, togglePopup }) {
  if (showing) {
    return (
      <div className={`popup ${className}`}>
        <div className="popup__close" onClick={togglePopup}>
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
