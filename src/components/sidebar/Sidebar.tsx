import React from "react"
import IconClose from "images/ui-kit/icon-close.svg"

interface ISideBar {
  className?: string
  close?: () => void
}

export default function Sidebar(props: ISideBar) {
  return (
    <div className={`sidebar ${props.className ? props.className : ""}`}>
      <button className="sidebar__close" onClick={() => props.close()}>
        <div className="icon-wrapper">
          <IconClose />
        </div>
      </button>
    </div>
  )
}
