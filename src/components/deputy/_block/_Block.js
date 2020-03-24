import React from "react"
import Header from "./header"

export default function _Block(props) {
  return (
    <div className={`deputy__block block__${props.type}`}>
      <Header type={props.type} title={props.title} color={props.color} />
      {props.type === "general" ? (
        <div
          className={`block__background ${props.type}__background`}
          style={{ backgroundColor: props.color }}
        ></div>
      ) : (
        <div className={`block__background ${props.type}__background`}></div>
      )}
      <div className={`block__content ${props.type}__content`}>
        {props.children}
      </div>
    </div>
  )
}
