import React from "react"

export default function Header(props) {
  return (
    <div className={`${props.type}__header block__header`}>
      {props.type === "general" ? (
        <div className="header__background">{/* Empty */}</div>
      ) : (
        <div
          className="header__background"
          style={{ backgroundColor: props.color }}
        >
          {/* Empty */}
        </div>
      )}
      {props.type === "general" ? (
        <h2 className="header__title">{props.title}</h2>
      ) : (
        <h2
          className="header__title"
          style={{
            color: props.color,
          }}
        >
          {props.title}
        </h2>
      )}
      <span className="block__close">
        <span></span>
        <span></span>
      </span>
    </div>
  )
}
