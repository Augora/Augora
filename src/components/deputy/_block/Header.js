import React from "react"

/**
 * Return header block in a div
 * @param {*} props
 */
export default function Header(props) {
  return (
    <div className={`${props.type}__header block__header`}>
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
    </div>
  )
}
