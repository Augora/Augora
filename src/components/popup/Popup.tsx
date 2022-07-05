import React from 'react'

function Popup({ children, show, setShow }) {
  if (show) {
    return (
      <div className="popup">
        <div className="popup__close" onClick={() => setShow(false)}>
          <span></span>
          <span></span>
        </div>
        { children }
      </div>
    )
  } else {
    return null
  }
}

export default Popup