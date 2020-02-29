import React from "react"
import Header from "templates/Utils/DeputyHeader"

export default function _Block(props) {
  return (
    <div
      className={`deputy__${props.type} block__${props.type}`}
      style={{ backgroundColor: props.color }}
    >
      <Header title={props.title} />
      {props.children}
    </div>
  )
}
