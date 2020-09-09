import React from "react"

/**
 * Return header block in a div
 * @param {*} props
 */
export default function Header(props) {
  return (
    <div className={`${props.type}__header block__header`}>
      {/* Verify if the block is general infos */}
      {props.type === "general" ? (
        <h2 className="header__title">{props.title}</h2>
      ) : !props.circ ? (
        // Verify if the block has no circonscription data
        <h2
          className="header__title"
          style={{
            color: props.color,
          }}
        >
          {props.title}
        </h2>
      ) : (
        // If there is circonscription data, change the header text
        <div className="header__title" style={{ color: props.color }}>
          <span>{props.circ.region}</span>
          <span>
            {props.circ.circNb}
            <small>{props.circ.circNb < 2 ? "ère " : "ème "}</small>
            circonscription
          </span>
        </div>
      )}
    </div>
  )
}
