import React from "react"

export default function Popup({
  className,
  children,
  visible,
  togglePopup,
}: {
  className: string
  children: React.ReactNode
  visible: boolean
  togglePopup: () => void
}) {
  return visible ? (
    <div className={`popup ${className}`}>
      <div className="popup__close" onClick={togglePopup}>
        <span />
        <span />
      </div>
      <div className="popup__wrapper">{children}</div>
    </div>
  ) : null
}
