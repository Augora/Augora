import React from "react"

export default function DeputyHeader(props) {
  return (
    <div>
      {props.title}
      <span className="close">X</span>
    </div>
  )
}
