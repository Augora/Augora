import React from "react"
import Header from "templates/Utils/DeputyHeader"

export default function _Block(props) {
  return (
    <div className={`deputy__block block__${props.type}`}>
      <span className="block__close">
        <span></span>
        <span></span>
      </span>
      <Header type={props.type} title={props.title} color={props.color} />
      {props.type === "general" ? (
        <div
          className={`block__background ${props.type}__background`}
          style={{ backgroundColor: props.color }}
        ></div>
      ) : (
        <div className={`block__background ${props.type}__background`}></div>
      )}
      {props.children}
    </div>
  )
}
